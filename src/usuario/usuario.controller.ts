import { Response, Request, NextFunction } from "express";
import { usuarioRepository } from "./usuario.repository.js";
import { Usuario } from "./usuario.entity.js";


const repository = new usuarioRepository()

export function sanitizeUsuarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombreDeUsuario: req.body.nombreDeUsuario,
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    fechaNacimiento: req.body.fechaNacimiento,
    mail: req.body.mail,
    nroTelefono: req.body.nroTelefono,
    itinerarios: req.body.itinerarios,
    //opiniones: req.body.opiniones
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  })

  next();
}


export async function findAll(req: Request, res: Response) {
  const usuarios = await repository.findAll();
  if (!usuarios) {
    return res.status(404).send({ data: 'No se encontraron usuarios' })
  }
  res.status(200).json({ data: usuarios });

}

export async function findOne(req: Request, res: Response) {
  const usuario = await repository.findOne({ id: req.params.id });
  if (!usuario) {
    return res.status(404).send({ message: "usuario no encontrado" });
  }
  res.json({ data: usuario });
}


export async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput
  const usuarioInput = new Usuario(
    input.nombreDeUsuario,
    input.nombres,
    input.apellidos,
    input.fechaNacimiento,
    input.mail,
    input.nroTelefono,
    input.itinerarios,
  );
  const usuario = await repository.add(usuarioInput);
  return res
    .status(201)
    .send({ message: "usuario cargado correctamente", data: usuario });
}

export async function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const result = (req.body.sanitizedInput);

  const usuario = await repository.update(req.body.sanitizedInput);
  if (!usuario) {
    return res.status(404).send({ message: "usuario no encontrado" });
  }

  res.status(200).send({
    message: "usuario actualizado correctamente",
    data: usuario,
  });
}

export async function remove(req: Request, res: Response) {
  const usuario = await repository.delete({ id: req.params.id });
  if (!usuario) {
    return res.status(404).send({ message: "usuario no encontrado" });
  }
  return res.status(200).json({ message: "usuario eliminado correctamente", data: usuario });
}
