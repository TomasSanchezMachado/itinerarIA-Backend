import { Response,Request,NextFunction } from "express";
import { Participante } from "./participante.entity.js";
import { orm } from "../shared/db/orm.js";
import { ObjectId } from "@mikro-orm/mongodb";

const em = orm.em;


export function sanitizeParticipanteInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    edad:req.body.edad,
    discapacidad:req.body.discapacidad,
    itinerario:req.body.itinerario
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
    const participantes = await em.find(Participante,{},{populate:['itinerario']})
    if(participantes.length === 0){
      return res.status(200).json({message: "No se encontraron participantes"});
    }
    res.status(200).json({data: participantes});
  }
  catch (error:any){
    return res.status(500).json({message: error.message});
  }
  
}
export async function findOne(req: Request, res: Response) {
try{
  const id = req.params.id;
  const objectId = new ObjectId(id);
  const participante = await em.findOneOrFail(Participante, { _id: objectId });
  return res.status(200).json({data: participante});
}
catch(error:any){
  return res.status(500).json({message: error.message});
}
}


export async function add(req: Request, res: Response) {
  try{
    const participante = em.create(Participante,req.body.sanitizedInput);
    await em.flush();
    return res.status(201).json({message:"Participante creado con exito",data: participante});
  
  } 
  catch(error:any){
    return res.status(500).json({message: error.message});

  }
}

export async function update(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const objectId = new ObjectId(id);
    const participante = em.getReference(Participante, objectId);
    em.assign(participante, req.body.sanitizedInput);
    await em.flush();
    return res.status(200).json({message: "Participante actualizado con exito", data: participante});
  }
  catch(error:any){
    return res.status(500).json({message: error.message});  
}
}


export async function remove(req: Request, res: Response) {
  try{
    const id = req.params.id
    const objectId = new ObjectId(id)
    const participante = em.getReference(Participante, objectId)
    await em.removeAndFlush(participante)
    res.status(200).send({ message: 'Participante borrado',data:participante })
  } 
  catch (error: any) {
    res.status(500).json({ message: error.message })
      }
}

