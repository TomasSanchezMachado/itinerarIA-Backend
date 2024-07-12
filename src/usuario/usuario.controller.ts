import { Response, Request, } from "express";
import { Usuario } from "./usuario.entity.js";
import { orm } from '../shared/db/orm.js'
import { ObjectId } from "@mikro-orm/mongodb";

const em = orm.em

export async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(Usuario, {}, { populate: ['itinerarios.actividades'] });
    res.status(200).json({ message: "Usuarios encontrados exitosamente:", data: usuarios });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const usuario = await em.findOneOrFail(Usuario, { _id: objectId }, { populate: ['itinerarios.actividades'] })
    return res
      .status(200)
      .json({ message: "Usuario encontrado exitosamente", data: usuario });
  } catch (error: any) {
    return res.status(500).send({ message: error.message });
  }
}


export async function add(req: Request, res: Response) {
  try {
    const usuario = em.create(Usuario, req.body);
    await em.flush();
    res.status(201).json({ message: "usuario creado correctamente", data: usuario });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const usuario = em.findOneOrFail(Usuario, objectId);
    em.assign(usuario, req.body);
    await em.flush();
    res
      .status(200)
      .json({ message: "usuario actualizado correctamente", data: usuario });
  } catch (error: any) {
    return res.status(500).send({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const usuario = em.findOneOrFail(Usuario, objectId);
    await em.removeAndFlush(usuario);
    res
      .status(200)
      .send({ message: "usuario eliminado correctamente" });
  } catch (error: any) {
    return res.status(500).send({ message: error.message });
  }
}

