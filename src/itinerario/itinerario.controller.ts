import { Response,Request,NextFunction } from "express";
import { Itinerario } from "./itinerario.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";

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
    actividades: req.body.actividades,
    participantes: req.body.participantes
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
    const itinerarios = await em.find(Itinerario,{},{populate: ['actividades','participantes']})
    if(itinerarios.length === 0){
      return res.status(200).json({message: "No se encontraron itinerarios"});
    }
    res.status(200).json({data: itinerarios});
  }
  catch (error:any){
    return res.status(500).json({message: error.message});
  }
  
}
export async function findOne(req: Request, res: Response) {
try{
  const id = req.params.id;
  //const objectId = new ObjectId(id);
  const itinerario = await em.findOneOrFail(Itinerario, { id } );
  return res.status(200).json({data: itinerario});
}
catch(error:any){
  return res.status(500).json({message: error.message});
}
}


export async function add(req: Request, res: Response) {
  try{
    const itinerario = em.create(Itinerario,req.body.sanitizedInput);
    await em.flush();
    return res.status(201).json({message:"Itinerario creado con exito",data: itinerario});
  
  } 
  catch(error:any){
    return res.status(500).json({message: error.message});

  }
}

export async function update(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const itinerario = em.getReference(Itinerario, id);
    em.assign(itinerario, req.body.sanitizedInput);
    await em.flush();
    return res.status(200).json({message: "Itinerario actualizado con exito", data: itinerario});
  }
  catch(error:any){
    return res.status(500).json({message: error.message});  
}
}


export async function remove(req: Request, res: Response) {
  try{
    const id = req.params.id
    const objectId = new ObjectId(id)
    const itinerario = em.getReference(Itinerario, id)
    await em.removeAndFlush(itinerario)
    res.status(200).send({ message: 'Itinerario borrado',data:itinerario })
  } 
  catch (error: any) {
    res.status(500).json({ message: error.message })
      }
}

