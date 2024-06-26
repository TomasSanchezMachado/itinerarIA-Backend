import {Entity,  ManyToOne,  Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Lugar } from "../lugar/lugar.entity.js";

@Entity()
export class ServicioExterno extends BaseEntity{

  @Property()
  tipoServicio!: string;

  @Property()
  nombre!: string;
 
  @Property()
  descripcion!: string;

  @Property()
  direccion!: string;

  @Property()
  horario!: string;

  @Property()
  sitioWeb!: string;

  @Property()
  telContacto!: string;

  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Lugar;

}