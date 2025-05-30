import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Activity } from "./activity.entity.js";
import { Itinerary } from "../itinerary/itinerary.entity.js";
import { populate } from "dotenv";

const em = orm.em;

function sanitizeActividadInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    outdoor: req.body.outdoor,
    transport: req.body.transport,
    // schedule: req.body.schedule,
    scheduleStart: req.body.scheduleStart,
    scheduleEnd: req.body.scheduleEnd,
    place: req.body.place,
    itinerary: req.body.itinerary,
    opinions: req.body.opinions,
  };
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const activity = await em.find(
      Activity,
      {},
      { populate: ["place", "itinerary", "opinions"] }
    );
    if (activity.length === 0) {
      return res.status(200).json({ message: "No activities found" });
    }
    res
      .status(200)
      .json({ message: "All activities found: ", data: activity });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const activity = await em.findOneOrFail(Activity, { id });
    res.status(200).json({ message: "Activity found", data: activity });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const itinerary = await em.findOne(
      Itinerary,
      { id: req.body.itinerary.id },
      { populate: ["user"] }
    );
    if (!itinerary) {
      return res.status(400).json({ message: ["Itinerary not found"] });
    }
    //Validacion que la activity no exista
    const actividadExistente = await em.findOne(Activity, {
      name: req.body.name,
      place: req.body.place.id,
      itinerary: itinerary.id,
    });
    if (actividadExistente) {
      return res.status(400).json({ message: ["Activity already exists"] });
    }
    req.body.sanitizedInput.itinerary = itinerary;
    const activity = em.create(Activity, {
      ...req.body.sanitizedInput,
      place: req.body.place.id,
    });
    await em.flush();
    res.status(201).json({ message: "Activity created", data: activity });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const actividadExistente = await em.findOne(Activity, {
      name: req.body.name,
      place: req.body.place,
      itinerary: req.body.itinerary,
    });
    if (actividadExistente && actividadExistente.id !== id) {
      return res.status(400).json({ message: ["Activity already exists"] });
    }
    const activity = em.getReference(Activity, id);
    em.assign(activity, {
      ...req.body.sanitizedInput,
      place: req.body.place.id,
    });
    await em.flush();
    res.status(200).json({
      message: "Activity updated",
      data: activity,
      itinerary: req.body.itinerary,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const activity = em.getReference(Activity, id);
    em.removeAndFlush(activity);
    res.status(200).json({ message: "Activity deleted", data: activity });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeActividadInput, findAll, findOne, add, update, remove };
