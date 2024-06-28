import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Lugar } from "../lugar/lugar.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

import { ObjectId } from '@mikro-orm/mongodb';
import crypto from 'node:crypto';

@Entity()
export class Actividad {
  
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  nombre!: string;

  @Property()
  descripcion!: string;

  @Property()
  aireLibre!: boolean;

  @Property()
  id = crypto.randomUUID();

  @Property()
  transporte?: string;

  // @Property()
  // horario?: string;

  // @Property()
  // fecha?: string;

}
// -Ver temas etiquetas (puede tener mas de una categoria?)
// -Ver temas de relaciones 
// type para la hora
// type para la fecha
// type para el transporte

