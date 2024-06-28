import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Actividad } from "./actividad.entity.js";

const em = orm.em

function sanitizeActividadInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    airelibre: req.body.airelibre,
    transporte: req.body.transporte,
    horario: req.body.horario,
    lugar: req.body.lugar
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const actividad = await em.find(Actividad, {}, { populate: ['lugar'] });
    if(actividad.length === 0){
      return res.status(200).json({message: 'No se encontraron actividades'});
    }
    res.status(200).json({message: 'Todos las actividades encontrados', data: actividad});
  }
  catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const actividad = await em.findOneOrFail(Actividad, { id });
    res.status(200).json({message: 'Actividad encontrada', data: actividad});
  }
  catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

async function add(req: Request, res: Response) {
  try {
    const actividad = em.create(Actividad, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Actvidad creada', data: actividad });
  }
  catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const actividad = em.getReference(Actividad, id);
    em.assign(actividad, req.body);
    await em.flush();
    res.status(200).json({ message: 'Actividad actualizada', data: actividad });
  }
  catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const actividad = em.getReference(Actividad, id);
    em.removeAndFlush(actividad);
    res.status(200).json({ message: 'Actividad eliminada', data: actividad });
  }
  catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

export {sanitizeActividadInput, findAll, findOne, add, update, remove };