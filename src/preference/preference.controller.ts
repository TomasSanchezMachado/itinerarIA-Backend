
import { Response,Request,NextFunction } from "express";
import { Preference } from "./preference.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";

const em = orm.em;

export function sanitizePreferenceInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name:req.body.name,
    description:req.body.description,
    itineraries:req.body.itineraries
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
    const preferencias = await em.find(Preference,{},{populate:['itineraries']})
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
  const preferencia = await em.findOneOrFail(Preference, { id: id }, { populate: ['itineraries'] });
  return res.status(200).json({data: preferencia});
}
catch(error:any){
  return res.status(500).json({message: error.message});
}
}


export async function add(req: Request, res: Response) {
  try{
    const preferencia = em.create(Preference,req.body.sanitizedInput);
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
    const preferencia = em.getReference(Preference, objectId);
    em.assign(preferencia, req.body.sanitizedInput);
    await em.flush();
    return res.status(200).json({message: "Preference actualizada con exito", data: preferencia});
  }
  catch(error:any){
    return res.status(500).json({message: error.message});  
}
}


export async function remove(req: Request, res: Response) {
  try{
    const id = req.params.id
    const objectId = new ObjectId(id)
    const preferencia = em.getReference(Preference, objectId)
    await em.removeAndFlush(preferencia)
    res.status(200).send({ message: 'Preference borrada',data:preferencia })
  } 
  catch (error: any) {
    res.status(500).json({ message: error.message })
      }
}

