import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { ExternalService } from "./externalService.entity.js";

const em = orm.em

function sanitizeExternalServiceInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    serviceType: req.body.serviceType,
    name: req.body.name,
    description: req.body.description,
    adress: req.body.adress,
    schedule: req.body.schedule,
    website: req.body.website,
    phoneNumber: req.body.phoneNumber,
    place: req.body.place
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const externalService = await em.find(ExternalService, {}, { populate: ['place'] });
    if(externalService.length === 0){
      return res.status(200).json({message: ['No se encontraron servicios externos']});
    }
    res.status(200).json({message: 'Todos los servicios externos encontrados', data: externalService});
  }
  catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const externalService = await em.findOneOrFail(ExternalService, { id }, { populate: ['place'] });
    res.status(200).json({message: 'Servicio externo encontrado', data: externalService});
  }
  catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

async function findByPlace(req: Request, res: Response) {
  try {
    const place = await em.findOne('Place', { id: req.params.id });
    if (!place) {
      return res.status(404).json({ message: ['No se encontró el place con ese id'] });
    }

    const serviciosExternos = await em.find(ExternalService, { place: req.params.id });
    if (serviciosExternos.length === 0) {
      return res.status(200).json({ message: ['No se encontraron servicios externos para el place'] });
    }
    res.status(200).json({ message: 'Servicios externos encontrados', data: serviciosExternos });
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const place = await em.findOne('Place', { id: req.body.sanitizedInput.place });
    if (!place) {
      return res.status(404).json({ message: ['No se encontró el place con ese id'] });
    }

    const externalService = await em.findOne(ExternalService, { name: req.body.sanitizedInput.name });
    if (externalService) {
      return res.status(409).json({ message: ['El servicio externo ya existe'] });
    }
    const NewExternalService = em.create(ExternalService, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Servicio externo creado', data: NewExternalService });
  }
  catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

async function update(req: Request, res: Response) {
  try {
    console.log("hola")
    const id = req.params.id;
    const { name } = req.body.sanitizedInput;

    // Verifica si ya existe un servicio con el mismo nombre, excluyendo el que se está actualizando
    const existingService = await em.findOne(ExternalService, { name });
    
    if (existingService && existingService.id !== id) {
      return res.status(409).json({ message: ['El nombre del servicio externo ya existe'] });
    }

    // Procede con la actualización si no hay conflicto
    const externalService = em.getReference(ExternalService, id);
    em.assign(externalService, { ...req.body.sanitizedInput, place: req.body.sanitizedInput.place.id });
    await em.flush();

    res.status(200).json({ message: 'Servicio externo actualizado', data: externalService });
  }
  catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const externalService = em.getReference(ExternalService, id);
    em.removeAndFlush(externalService);
    res.status(200).json({ message: 'Servicio externo eliminado', data: externalService });
  }
  catch (error: any) {
    res.status(500).json({message: error.message});
  }
}

export {sanitizeExternalServiceInput, findAll, findByPlace,findOne, add, update, remove };