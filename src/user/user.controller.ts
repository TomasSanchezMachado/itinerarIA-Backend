import { Response, Request, NextFunction } from "express";
import { User } from "./user.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";
import createAccessToken from "../libs/jwt.js";
import jwt from "jsonwebtoken";


const em = orm.em;

export function sanitizeUsuarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    username: req.body.username,
    password: req.body.password,
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    fechaNacimiento: req.body.fechaNacimiento,
    mail: req.body.mail,
    nroTelefono: req.body.nroTelefono,
    itinerarios: req.body.itinerarios,
    opiniones: req.body.opiniones,
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
    const users = await em.find(
      User,
      {},
      { populate: ["itineraries.activities","participants"] }
    );
    res.header("Access-Control-Allow-Origin", "*");
    res
      .status(200)
      .json({ message: "Users encontrados exitosamente:", data: users });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const user = await em.findOneOrFail(
      User,
      { _id: objectId },
      { populate: ["itineraries.activities", "participants"] }
    );
    return res
      .status(200)
      .json({ message: "User encontrado exitosamente", data: user });
  } catch (error: any) {
    return res.status(500).send({ message: error.message });
  }
}

export async function add(req: Request, res: Response) {
  try {
    const usuarioCreado = em.create(User, req.body.sanitizedInput);
    const token = await createAccessToken({ username: usuarioCreado.username })
    res.cookie('token', token);
    await em.flush();
    res.status(201).json({ message: "User creado correctamente",data:usuarioCreado});
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function findOneByPassword(req: Request, res: Response) {
  try {
    const password = req.params.password;
    const user = await em.findOneOrFail(User, { password: password });
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}


export async function update(req: Request, res: Response) {
  try {
    console.log(req.body.sanitizedInput, req.params.id);
    const user = em.getReference(User, req.params.id);
    const nuevoUsuario = em.assign(user, req.body.sanitizedInput);
    console.log(nuevoUsuario);
    await em.flush();
    jwt.sign({ username: nuevoUsuario.username }, 'secret', {
      expiresIn: "7d",
    });
    res
      .status(200)
      .json({ message: "user actualizado correctamente", data: user });
  } catch (error: any) {
    console.log("Error actualizando el user:", error);
    return res.status(500).send({ message: error.message });
  }
}


export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const user = em.getReference(User, objectId);
    await em.removeAndFlush(user);
    res.status(200).send({ message: "user eliminado correctamente" });
  } catch (error: any) {
    return res.status(500).send({ message: error.message });
  }
}
