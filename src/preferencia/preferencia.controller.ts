import { Response, Request, NextFunction } from "express";
import { Preferencia } from "./preferencia.entity.js";
import { orm } from '../shared/db/orm.js'
import { ObjectId } from "@mikro-orm/mongodb";


const em = orm.em

export function sanitizeUsuarioInput(
  req: Request,
  res: Response,
  next: NextFunction){
    
  }