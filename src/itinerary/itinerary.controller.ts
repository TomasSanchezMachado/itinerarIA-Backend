import { Response, Request, NextFunction } from "express";
import { Itinerary } from "./itinerary.entity.js";
import { orm } from "../shared/db/orm.js";
import { Usuario } from "../usuario/usuario.entity.js";
import { Participant } from "../participant/participant.entity.js";
import { ObjectId } from "@mikro-orm/mongodb";

const em = orm.em;


export function sanitizeItineraryInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
    activities: req.body.activities,
    participants: req.body.participants,
    user: req.body.user,
    place: req.body.place
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  })

  next();
}


export async function findAll(req: Request, res: Response) {
  try {
    const itineraries = await em.find(Itinerary, {}, { populate: ['activities', 'participants.preferences', 'user', 'place'] });
    if (itineraries.length === 0) {
      return res.status(200).json({ message: "No se encontraron itinerarios" });
    }
    res.status(200).json({ data: itineraries });
  }
  catch (error: any) {
    return res.status(500).json({ message: error.message });
  }

}

export async function findAllByUser(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const itineraries = await em.find(Itinerary, { user: id }, { populate: ['activities', 'participants.preferences', 'user', 'place'] });
    if (itineraries.length === 0) {
      return res.status(200).json({ message: "No se encontraron itinerarios" });
    }
    res.status(200).json({ data: itineraries });
  }
  catch (error: any) {
    return res.status(500).json({ message: error.message });
  }

}
export async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    //const objectId = new ObjectId(id);
    const itinerary = await em.findOneOrFail(Itinerary, { id }, { populate: ['activities', 'participants', 'user', 'place'] });
    return res.status(200).json({ data: itinerary });
  }
  catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}


export async function add(req: Request, res: Response) {
  try {
    // Valido que el usuario ingresado exista
    const userFound = await em.findOne(Usuario, { id: req.body.sanitizedInput.user });
    if (!userFound) {
      return res.status(400).json({ message: "El usuario ingresado no existe" });
    }

    console.log(req.body.sanitizedInput.participants, 'req.body.sanitizedInput.participants');

    const itinerary = em.create(Itinerary, { ...req.body.sanitizedInput, participants: [] });

    // Uso de for...of para esperar cada operación asíncrona
    for (const participant of req.body.sanitizedInput.participants) {
      if (participant.id === undefined) {
        // Creo el participante si no existe
        const participantCreated = em.create(Participant, {...participant, preferences: participant.preferences.map((preference: any) => new ObjectId(preference))});
        console.log(participantCreated, 'participantCreated');
        itinerary.participants.add(participantCreated);
      } else {
        // Si ya existe (de favoritos), lo busco y lo agrego
        const participantFound = await em.findOne(Participant, participant.id);
        console.log(participantFound, 'participantFound');
        if (participantFound) {
          itinerary.participants.add(participantFound);
        } else {
          console.log(`Participante con ID ${participant.id} no encontrado`);
        }
      }
    }
    console.log('---------------------------------');
    console.log(itinerary.participants, 'itinerary.participants');
    await em.persistAndFlush(itinerary);

    return res.status(201).json({ message: "Itinerario creado con éxito", data: itinerary });
    
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}


export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    // //Valido que, en caso de quererse cambiar el usuario,exista
    // if(req.body.sanitizedInput.usuario){
    //   const usuario = await em.findOne('Usuario', {id: req.body.sanitizedInput.usuario});
    //   if(!usuario){
    //     return res.status(400).json({message: "El usuario ingresado no existe"});
    //   }
    // }
    const itinerary = em.getReference(Itinerary, id);
    em.assign(itinerary, req.body.sanitizedInput);
    await em.flush();
    return res.status(200).json({ message: "Itinerario actualizado con exito", data: itinerary });
  }
  catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}


export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const itinerary = em.getReference(Itinerary, id)
    await em.removeAndFlush(itinerary)
    res.status(204).send({ message: 'Itinerario borrado', data: itinerary })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

