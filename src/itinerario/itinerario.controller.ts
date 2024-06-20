import { Response,Request,NextFunction } from "express";
import { ItinerarioRepository } from "./itinerario.repository.js";
import { Itinerario } from "./itinerario.entity.js";


const repository = new ItinerarioRepository()

export function sanitizeItinerarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    ubicacion: req.body.ubicacion,
    codigoPostal: req.body.codigoPostal,
    provincia: req.body.provincia,
    pais: req.body.pais
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  })

  next();
}


export async function findAll(req: Request, res: Response) {
  const itinerarios = await repository.findAll();
  if (!itinerarios) {
    return res.status(404).send({data:'Itinerario no encontrado'})
  }
  res.status(200).json({data:itinerarios});
  
}

export async function findOne(req: Request, res: Response) {
  const itinerario = await repository.findOne({ id: req.params.id });
  if (!itinerario) {
    return res.status(404).send({ message: "Itinerario no encontrado" }); 
  }
  res.json({data: itinerario});
}


export async function add(req: Request, res: Response) {
  const result = req.body.sanitizedInput;
  const input = result.data;
  const itinerarioInput = new Itinerario(
    
  );
  const itinerario = await repository.add(itinerarioInput);
  return res
    .status(201)
    .send({ message: "Itinerario cargado correctamente", data: itinerario });
}

export async function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const result = (req.body.sanitizedInput);

  const itinerario = await repository.update(req.body.sanitizedInput);
  if (!itinerario) {
    return res.status(404).send({ message: "Itinerario no encontrado" });
  }

  res.status(200).send({
    message: "Itinerario actualizado correctamente",
    data: itinerario,
  });
}

export async function remove(req: Request, res: Response) {
  const itinerario = await repository.delete({ id: req.params.id });
  if (!itinerario) {
    return res.status(404).send({ message: "Itinerario no encontrado" }); 
  }
  return res.status(200).json({message:"Itinerario eliminado correctamente", data: itinerario});
}


