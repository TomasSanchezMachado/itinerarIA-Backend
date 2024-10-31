import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Opinion } from "./opinion.entity.js";

const em = orm.em;

function sanitizeOpinionInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    calificacion: req.body.calificacion,
    comentario: req.body.comentario,
    user: req.body.user,
    activity: req.body.activity,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const opinion = await em.find(Opinion, {}, { populate: ["user", "activity"] });
    if (opinion.length === 0) {
      return res.status(200).json({ message: "No se encontraron opiniones" });
    }
    res
      .status(200)
      .json({ message: "Todos las opiniones encontradas", data: opinion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const opinion = await em.findOneOrFail(Opinion, { id });
    res.status(200).json({ message: "Opinion encontrada: ", data: opinion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const opinion = em.create(Opinion, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: "Opinion creada", data: opinion });
  } catch (error: any) {
    res.status(500).json({ message: error.message, data: req.body.sanitizedInput });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const opinion = await em.findOneOrFail(Opinion, { id });
    Object.assign(opinion, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: "Opinion actualizada", data: opinion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const opinion = em.getReference(Opinion, id);
    em.removeAndFlush(opinion);
    res.status(200).json({ message: "Opinion eliminada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


export { sanitizeOpinionInput, findAll, findOne, add, update, remove };

