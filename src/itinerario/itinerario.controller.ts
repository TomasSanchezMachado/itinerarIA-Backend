import { Response,Request,NextFunction } from "express";
import { Itinerario } from "./itinerario.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;


export function sanitizeItinerarioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    cantDias: req.body.cantDias,
    actividades: new Uint8Array(req.body.actividades),
    transporte: req.body.transporte
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  })

  next();
}


export async function findAll(req: Request, res: Response) {
  try{
    const itinerarios = await em.find(Itinerario,{})
    res.status(200).json({data: itinerarios});
  }
  catch (error:any){
    return res.status(500).json({message: error.message});
  }
  
}
export async function findOne(req: Request, res: Response) {
try{
  const id = req.params.id;
  //const itinerario = await em.findOne(Itinerario,{id: id})
  return res.status(200).json({data: "findOne function"})
}
catch(error:any){
  return res.status(404).json({message: error.message});
}
}


export async function add(req: Request, res: Response) {
  return res.status(500).json({message: "add function"});  
}

export async function update(req: Request, res: Response) {
  return res.status(500).json({message: "add function"});  
}



export async function remove(req: Request, res: Response) {
  return res.status(500).json({message: "add function"});  
}


