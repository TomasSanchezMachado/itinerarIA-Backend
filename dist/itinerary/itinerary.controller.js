import { Itinerary } from "./itinerary.entity.js";
import { orm } from "../shared/db/orm.js";
import { User } from "../user/user.entity.js";
import { Participant } from "../participant/participant.entity.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { generateText } from "../geminiAI/prueba_conexion.js";
import { Place } from "../place/place.entity.js";
const em = orm.em;
export function sanitizeItineraryInput(req, res, next) {
    req.body.sanitizedInput = {
        title: req.body.title,
        description: req.body.description,
        // duration: req.body.duration,
        dayStart: req.body.dayStart,
        dayEnd: req.body.dayEnd,
        activities: req.body.activities,
        participants: req.body.participants,
        user: req.body.user,
        place: req.body.place
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
export async function findAll(req, res) {
    try {
        const itineraries = await em.find(Itinerary, {}, { populate: ['activities', 'participants.preferences', 'user', 'place'] });
        if (itineraries.length === 0) {
            return res.status(200).json({ message: "No se encontraron itinerarios" });
        }
        res.status(200).json({ data: itineraries });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function findAllByUser(req, res) {
    try {
        const id = req.params.id;
        const itineraries = await em.find(Itinerary, { user: id }, { populate: ['activities', 'participants.preferences', 'user', 'place'] });
        if (itineraries.length === 0) {
            return res.status(200).json({ message: "No se encontraron itinerarios" });
        }
        res.status(200).json({ data: itineraries });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function findOne(req, res) {
    try {
        const id = req.params.id;
        //const objectId = new ObjectId(id);
        const itinerary = await em.findOneOrFail(Itinerary, { id }, { populate: ['activities', 'participants', 'user', 'place'] });
        return res.status(200).json({ data: itinerary });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function add(req, res) {
    try {
        // Valido que el user ingresado exista
        const userFound = await em.findOne(User, { id: req.body.sanitizedInput.user });
        if (!userFound) {
            return res.status(400).json({ message: "El user ingresado no existe" });
        }
        console.log(req.body.sanitizedInput.participants, 'req.body.sanitizedInput.participants');
        //parseo los dias
        req.body.sanitizedInput.dayStart = new Date(req.body.sanitizedInput.dayStart);
        req.body.sanitizedInput.dayEnd = new Date(req.body.sanitizedInput.dayEnd);
        const itinerary = em.create(Itinerary, { ...req.body.sanitizedInput, participants: [] });
        // Uso de for...of para esperar cada operación asíncrona
        for (const participant of req.body.sanitizedInput.participants) {
            if (participant.id === undefined) {
                // Creo el participante si no existe
                const participantCreated = em.create(Participant, { ...participant, preferences: participant.preferences.map((preference) => new ObjectId(preference)) });
                console.log(participantCreated, 'participantCreated');
                itinerary.participants.add(participantCreated);
            }
            else {
                // Si ya existe (de favoritos), lo busco y lo agrego
                const participantFound = await em.findOne(Participant, participant.id);
                console.log(participantFound, 'participantFound');
                if (participantFound) {
                    itinerary.participants.add(participantFound);
                }
                else {
                    console.log(`Participante con ID ${participant.id} no encontrado`);
                }
            }
        }
        await em.persistAndFlush(itinerary);
        return res.status(201).json({ message: "Itinerario creado con éxito", data: itinerary });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function addWithAI(req, res) {
    try {
        // Valido que el user ingresado exista
        const userFound = await em.findOne(User, { id: req.body.sanitizedInput.user });
        if (!userFound) {
            return res.status(400).json({ message: "El user ingresado no existe" });
        }
        const place = await em.findOne(Place, { id: req.body.sanitizedInput.place });
        if (!place) {
            return res.status(400).json({ message: "El place ingresado no existe" });
        }
        const participants = req.body.sanitizedInput.participants;
        const ages = participants.map((participant) => participant.age);
        const preferences = participants.reduce((acc, participant) => {
            if (participant.preferences) {
                return acc.concat(participant.preferences.map((preference) => preference.name));
            }
            return acc;
        }, []);
        const itineraryAI = await generateText(req.body.sanitizedInput.dayStart, req.body.sanitizedInput.dayEnd, place.name, req.body.sanitizedInput.title, ages, preferences);
        const itineraryAIJSON = JSON.parse(itineraryAI);
        const activities = itineraryAIJSON.activities;
        for (const activity of activities) {
            const existingPlace = await em.findOne(Place, { name: activity.place.name, country: activity.place.country, province: activity.place.province });
            if (!existingPlace) {
                const newPlace = em.create(Place, activity.place);
                activity.place = newPlace;
            }
            else {
                activity.place = existingPlace;
            }
        }
        const itinerary = em.create(Itinerary, { ...itineraryAIJSON, user: req.body.sanitizedInput.user, participants: [], place: req.body.sanitizedInput.place });
        // Uso de for...of para esperar cada operación asíncrona
        participants.forEach(async (participant) => {
            if (participant.id && participant.id === undefined) {
                // Creo el participante si no existe
                const participantCreated = em.create(Participant, { ...participant, preferences: participant.preferences.map((preference) => new ObjectId(preference.id)) });
                console.log(participantCreated, 'participantCreated');
                itinerary.participants.add(participantCreated);
            }
            else {
                // Si ya existe (de favoritos), lo busco y lo agrego
                const participantFound = await em.findOne(Participant, participant);
                console.log(participantFound, 'participantFound');
                if (participantFound) {
                    itinerary.participants.add(participantFound);
                }
                else {
                    console.log(`Participante con ID ${participant.id} no encontrado`);
                }
            }
        });
        await em.persistAndFlush(itinerary);
        return res.status(201).json({ message: "Itinerario creado con éxito", data: itinerary });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function update(req, res) {
    try {
        const id = req.params.id;
        // //Valido que, en caso de quererse cambiar el user,exista
        // if(req.body.sanitizedInput.user){
        //   const user = await em.findOne('User', {id: req.body.sanitizedInput.user});
        //   if(!user){
        //     return res.status(400).json({message: "El user ingresado no existe"});
        //   }
        // }
        const itinerary = em.getReference(Itinerary, id);
        em.assign(itinerary, req.body.sanitizedInput);
        await em.flush();
        return res.status(200).json({ message: "Itinerario actualizado con exito", data: itinerary });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function remove(req, res) {
    try {
        const id = req.params.id;
        const itinerary = em.getReference(Itinerary, id);
        await em.removeAndFlush(itinerary);
        res.status(204).send({ message: 'Itinerario borrado', data: itinerary });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//# sourceMappingURL=itinerary.controller.js.map