import { Response, Request, NextFunction } from "express";
import { Place } from "./place.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;


export function sanitizePlaceInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    zipCode: req.body.zipCode,
    province: req.body.province,
    country: req.body.country
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
    const places = await em.find(Place, {}, { populate: ['externalServices', 'activities', 'itineraries'] });
    if (places.length === 0) {
      return res.status(200).json({ message: "No places found", data: places });
    }
    res.status(200).json({ data: places });
  }
  catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const place = await em.findOneOrFail(Place, { id }, { populate: ['externalServices', 'activities', 'itineraries'] });
    return res.status(200).json({ data: place });
  }
  catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    // Validation to ensure the place does not already exist
    const existingPlace = await em.findOne(Place, { latitude: req.body.latitude, longitude: req.body.longitude });
    if (existingPlace) {
      return res.status(400).json({ message: "There is already a place with the same coordinates" });
    }
    else {
      const place = em.create(Place, req.body.sanitizedInput);
      await em.flush();
      return res.status(201).json({ message: "Place created successfully", data: place });
    }
  }
  catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const existingPlace = await em.findOne(Place, { latitude: req.body.latitude, longitude: req.body.longitude });
    if (existingPlace && existingPlace.id !== id) {
      return res.status(400).json({ message: "There is already a place with the same coordinates!" });
    }
    else {
      const place = em.getReference(Place, id);
      em.assign(place, req.body.sanitizedInput);
      await em.flush();
      return res.status(200).json({ message: "Place updated successfully", data: place });
    }
  } catch (error: any) {
    console.error("Error updating place:", error);
    res.status(500).json({ message: "Error updating place", error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const place = await em.findOneOrFail(Place, { id }, { populate: ['externalServices', 'activities', 'itineraries'] });
    if (place.externalServices.length > 0) {
      return res.status(400).json({ message: "Cannot delete the place because it has associated external services" });
    }
    else if (place.itineraries.length > 0) {
      return res.status(400).json({ message: "Cannot delete the place because it has associated itineraries" });
    }
    else {
      await em.removeAndFlush(place);
      return res.status(200).send({ message: 'Place deleted', data: place });
    }
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


