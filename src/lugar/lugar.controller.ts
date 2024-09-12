import { Response, Request, NextFunction } from "express";
import { validateLugar, validatePartialLugar } from "../schemas/lugar.js";
import { Lugar } from "./lugar.entity.js";
import { orm } from "../shared/db/orm.js";

const em = orm.em;


export function sanitizeLugarInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    ubicacion_latitud: req.body.ubicacion_latitud,
    ubicacion_longitud: req.body.ubicacion_longitud,
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
  try{
    const lugares = await em.find(Lugar,{}, { populate: ['serviciosExternos'] })
    if(lugares.length === 0){
      return res.status(200).json({message: "No se encontraron lugares"});
    }
    res.status(200).json({data: lugares});
  }
  catch (error:any){
    return res.status(500).json({message: error.message});
  }
  
}
export async function findOne(req: Request, res: Response) {
try{
  const id = req.params.id;
  const lugar = await em.findOneOrFail(Lugar, { id });
  return res.status(200).json({data: lugar});
}
catch(error:any){
  return res.status(500).json({message: error.message});
}
}


export async function add(req: Request, res: Response) {
  try{
    //Validacion que el lugar no exista
    const lugarExistente = await em.findOne(Lugar, { nombre: req.body.nombre });
    if (lugarExistente) {
      return res.status(400).json({message: "El lugar ya existe"});
    }
    const lugar = em.create(Lugar,req.body.sanitizedInput);
    await em.flush();
    return res.status(201).json({message:"Lugar creado con exito",data: lugar});
  
  } 
  catch(error:any){
    return res.status(500).json({message: error.message});

  }
}

export async function update(req: Request, res: Response) {
  try{
    const id = req.params.id;
    const lugar = em.getReference(Lugar, id);
    em.assign(lugar, req.body.sanitizedInput);
    await em.flush();
    return res.status(200).json({ message: "Lugar actualizado con exito", data: lugar });
  } catch (error: any) {
    console.error("Error actualizando el lugar:", error);
    res.status(500).json({ message: "Error actualizando el lugar", error: error.message });
  }
}


export async function remove(req: Request, res: Response) {
  try{
    const id = req.params.id
        const lugar = em.getReference(Lugar, id)
        await em.removeAndFlush(lugar)
        res.status(200).send({ message: 'Lugar borrado',data:lugar })
      } 
      catch (error: any) {
        res.status(500).json({ message: error.message })
      }
    }

