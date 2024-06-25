import {Entity,  Property, PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from '@mikro-orm/mongodb';
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class ServicioExterno extends BaseEntity{

  @Property()
  tipoServicio!: string;

  @Property()
  nombre!: string;
 
  @Property()
  descripcion!: string;

  @Property()
  precio!: number;

  @Property()
  direccion!: string;

  @Property()
  horario!: string;

  @Property()
  sitioWeb!: string;

  @Property()
  telContacto!: string;

  /*

  @Property({ type: DateTimeType })
  createdAt? = new Date()

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date(),
  })
  updatedAt? = new Date()

  */


}