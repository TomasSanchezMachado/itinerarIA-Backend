
import { Response,Request,NextFunction } from "express";
import { Preferencia } from "./preferencia.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";

const em = orm.em;

export function sanitizePreferenciaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre:req.body.nombre,
    descripcion:req.body.descripcion,
    participante:req.body.participante
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
    const preferencias = await em.find(Preferencia,{},{populate:['participante']})
    if(preferencias.length === 0){
      return res.status(200).json({message: "No se encontraron preferencias"});
    }
    res.status(200).json({data: preferencias});
  }
  catch (error:any){
    return res.status(500).json({message: error.message});
  }
  
}
export async function findOne(req: Request, res: Response) {
try{
  const id = req.params.id;
  const objectId = new ObjectId(id);
  const preferencia = await em.findOneOrFail(Preferencia, { _id: objectId });
  return res.status(200).json({data: preferencia});
}
catch(error:any){
  return res.status(500).json({message: error.message});
}
}


export async function add(req: Request, res: Response) {
  try{
    const preferencia = em.create(Preferencia,req.body.sanitizedInput);
    await em.flush();
    return res.status(201).json({message:"Preferencia creada con exito",data: preferencia});
  
  } 
  catch(error:any){
    return res.status(500).json({message: error.message});

  }
}

export async function update(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const preferencia = em.getReference(Preferencia, objectId);
    em.assign(preferencia, req.body.sanitizedInput);
    await em.flush();
    return res.status(200).json({message: "Preferencia actualizada con exito", data: preferencia});
  }
  catch(error:any){
    return res.status(500).json({message: error.message});  
}
}


export async function remove(req: Request, res: Response) {
  try{
    const id = req.params.id
    const objectId = new ObjectId(id)
    const preferencia = em.getReference(Preferencia, objectId)
    await em.removeAndFlush(preferencia)
    res.status(200).send({ message: 'Preferencia borrada',data:preferencia })
  } 
  catch (error: any) {
    res.status(500).json({ message: error.message })
      }
}

