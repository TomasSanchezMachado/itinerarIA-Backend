import { Response, Request, NextFunction } from "express";
import {
  validateParticipant,
  validatePartialParticipant,
} from "../schemas/participant.js";
import { Participant } from "./participant.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import { Itinerary } from "../itinerary/itinerary.entity.js";
import { Preference } from "../preference/preference.entity.js";
import { User } from "../user/user.entity.js";

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
    itineraries: req.body.itineraries,
    preferences: req.body.preferences,
    user: req.body.user,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

export async function findAll(req: Request, res: Response) {
  try {
    const userId = new ObjectId(req.params.userId);
    const participants = await em.find(
      Participant,
      { user: userId },
      { populate: ["preferences"] }
    );
    if (participants.length === 0) {
      return res
        .status(200)
        .json({ message: "Participants not found", data: participants });
    }
    res.status(200).json({ data: participants });
  } catch (error: any) {
    return res.status(500).json({ message: [error.message]});
  }
}
export async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const participant = await em.findOneOrFail(
      Participant,
      { id },
      { populate: ["preferences"] }
    );
    return res.status(200).json({ data: participant });
  } catch (error: any) {
    return res.status(500).json({ message: [error.message] });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const { preferences } = req.body.sanitizedInput;
    const userId = req.body.sanitizedInput.user.id;
    const userFound = await em.findOneOrFail(
      User,
      { id: userId },
      { populate: ["participants"] }
    );
    let preferencesId: ObjectId[] = [];
    preferences.forEach((preference: any) => {
      preferencesId.push(new ObjectId(preference));
    });

    const participant = em.create(Participant, {
      ...req.body.sanitizedInput,
      preferences: preferencesId,
      user: userFound.id,
    });


    await em.persistAndFlush(participant);
    return res.status(201).json({
      message: "Participant created successfully",
      data: participant,
      req: req.body.sanitizedInput,
    });
  } catch (error: any) {
    console;
    console.log(error);
    return res
      .status(500)
      .json({ message: [error.message], req: req.body.sanitizedInput });
  }
}

export async function addFavorite(req: Request, res: Response) {
  try {
    const { preferences } = req.body.sanitizedInput;
    const userId = req.body.sanitizedInput.user.id;
    const userFound = await em.findOneOrFail(
      User,
      { id: userId },
      { populate: ["participants"] }
    );
    let preferencesId: ObjectId[] = [];
    preferences.forEach((preference: any) => {
      preferencesId.push(new ObjectId(preference));
    });
    const participant = em.create(Participant, {
      ...req.body.sanitizedInput,
      preferences: preferencesId,
      user: userFound,
    });
    await em.persistAndFlush(participant);


    return res.status(201).json({
      message: "Participant created successfully",
      data: participant,
      req: req.body.sanitizedInput,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: [error.message],
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { name, age, disability, preferences, user } =
      req.body.sanitizedInput;
    const id = req.params.id;

    
    const participant = await em.findOneOrFail(Participant, id);

    // Obtener las preferencias correctamente
    const preferenceIds = preferences.map(
      (preference: ObjectId) => preference.id
    );
    const preferenceEntities = await em.find(Preference, {
      id: { $in: preferenceIds },
    });

    if (preferenceEntities.length !== preferences.length) {
      throw new Error("One or more preferences not found.");
    }

    // Asignar manualmente los valores
    participant.name = name;
    participant.age = age;
    participant.disability = disability;
    participant.preferences.set(preferenceEntities); // Usar set para ManyToMany

    await em.flush();
    return res
      .status(200)
      .json({ message: "Participant updated successfully", data: participant });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating participant", error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const participant = em.getReference(Participant, id);
    await em.removeAndFlush(participant);
    res
      .status(200)
      .send({ message: "Participant deleted successfully", data: participant });
  } catch (error: any) {
    res.status(500).json({ message: [error.message] });
  }
}
