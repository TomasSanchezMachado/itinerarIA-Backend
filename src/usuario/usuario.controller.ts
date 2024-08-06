import { Response, Request, NextFunction, } from "express";
import { Usuario } from "./usuario.entity.js";
import { orm } from '../shared/db/orm.js'
import { ObjectId } from "@mikro-orm/mongodb";
import bcrypt from 'bcrypt'


const em = orm.em

export function sanitizeUsuarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombreDeUsuario: req.body.nombreDeUsuario,
    password : req.body.password,
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    fechaNacimiento: req.body.fechaNacimiento,
    mail: req.body.mail,
    nroTelefono: req.body.nroTelefono,
    itinerarios: req.body.itinerarios,
    opiniones: req.body.opiniones
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
    const usuarios = await em.find(Usuario, {}, { populate: ['itinerarios.actividades'] });
    res.header('Access-Control-Allow-Origin', '*');
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
    //Validacion de que no exista un usuario con el mismo nombre de usuario
    const usuarioExistente = await em.findOne(Usuario, { nombreDeUsuario: req.body.nombreDeUsuario });
    if (usuarioExistente) {
      return res.status(400).json({ message: "Ya existe un usuario con ese nombre de usuario" });
    }
    // hash de la contraseña
    req.body.sanitizedInput.password = bcrypt.hashSync(req.body.sanitizedInput.password, 10);
    console.log(req.body.sanitizedInput.password);
    const usuario = em.create(Usuario, req.body.sanitizedInput);
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
    const usuario = em.getReference(Usuario, objectId);
    await em.removeAndFlush(usuario);
    res
      .status(200)
      .send({ message: "usuario eliminado correctamente" });
  } catch (error: any) {
    return res.status(500).send({ message: error.message });
  }
}

