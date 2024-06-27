import {Entity,  ManyToOne,  Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Lugar } from "../lugar/lugar.entity.js";

@Entity()
export class ServicioExterno extends BaseEntity{
<<<<<<< HEAD
 
  @Property()
=======

  @Property({nullable: false})
>>>>>>> b8bf670be0ddaf37f7c056c9b2cfc7eacd50528c
  tipoServicio!: string;

  @Property({nullable: false})
  nombre!: string;
 
  @Property({nullable: false})
  descripcion!: string;

  @Property({nullable: false})
  direccion!: string;

  @Property({nullable: false})
  horario!: string;

  @Property({nullable: false})
  sitioWeb!: string;

  @Property({nullable: false})
  telContacto!: string;

  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Lugar;

}