import { Itinerary } from "./itinerary.entity.js";
import { orm } from "../shared/db/orm.js";
import { Usuario } from "../usuario/usuario.entity.js";
const em = orm.em;
export function sanitizeItineraryInput(req, res, next) {
    req.body.sanitizedInput = {
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
        activities: req.body.activities,
        participants: req.body.participants,
        user: req.body.user
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
        const itineraries = await em.find(Itinerary, {}, { populate: ['activities', 'participants', 'user'] });
        if (itineraries.length === 0) {
            return res.status(200).json({ message: "No se encontraron itinerarios" });
        }
        res.header('Access-Control-Allow-Origin', '*');
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
        const itinerary = await em.findOneOrFail(Itinerary, { id });
        return res.status(200).json({ data: itinerary });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function add(req, res) {
    try {
        //Valido que el usuario ingresado exista
        const user = await em.findOne(Usuario, { id: req.body.sanitizedInput.user });
        if (!user) {
            return res.status(400).json({ message: "El usuario ingresado no existe" });
        }
        const itinerary = em.create(Itinerary, req.body.sanitizedInput);
        await em.flush();
        return res.status(201).json({ message: "Itinerario creado con exito", data: itinerary });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export async function update(req, res) {
    try {
        const id = req.params.id;
        //Valido que, en caso de quererse cambiar el usuario,exista
        if (req.body.sanitizedInput.usuario) {
            const usuario = await em.findOne('Usuario', { id: req.body.sanitizedInput.usuario });
            if (!usuario) {
                return res.status(400).json({ message: "El usuario ingresado no existe" });
            }
        }
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
        res.status(200).send({ message: 'Itinerario borrado', data: itinerary });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//# sourceMappingURL=itinerary.controller.js.map