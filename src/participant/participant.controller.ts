import { Response, Request, NextFunction } from "express";
import { validateParticipant, validatePartialParticipant } from "../schemas/participant.js";
import { Participant } from "./participant.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;


export function sanitizeParticipantInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name: req.body.name,
    age: req.body.age,
    disability: req.body.disability,
    itinerary: req.body.itinerary
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
    const participants = await em.find(Participant, {}, { populate: ["itineraries"] });
    if (participants.length === 0) {
      return res.status(200).json({ message: "Participants not found", data: participants });
    }
    res.status(200).json({ data: participants });
  }
  catch (error: any) {
    return res.status(500).json({ message: error.message });
  }

}
export async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const participant = await em.findOneOrFail(Participant, { id });
    return res.status(200).json({ data: participant });
  }
  catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}


export async function add(req: Request, res: Response) {
  try {

    // No verifico si el participante ya existe porque no hay un campo que lo identifique unicamente, ademas del id. Pueden existir dos personas que se llamen igual dentro del mismo itinerario.
    const participant = em.create(Participant, req.body.sanitizedInput);
    await em.flush();
    return res.status(201).json({ message: "Participant created successfully", data: participant });

  }
  catch (error: any) {
    return res.status(500).json({ message: error.message });

  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    console.log(id);
    const participant = em.getReference(Participant, id);
    console.log(participant);
    console.log(req.body.sanitizedInput);
    em.assign(participant, req.body.sanitizedInput);
    await em.flush();
    return res.status(200).json({ message: "Participant updated successfully", data: participant });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating participant", error: error.message });
  }
}


export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const participant = em.getReference(Participant, id)
    await em.removeAndFlush(participant)
    res.status(200).send({ message: 'Participant deleted successfully', data: participant })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

