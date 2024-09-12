import {Entity,  ManyToOne,  Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Lugar } from "../lugar/lugar.entity.js";

@Entity()
export class ServicioExterno extends BaseEntity{

  @Property({nullable: false})
  tipoServicio!: string;

  @Property({nullable: false})
  nombre!: string;
 
  @Property({nullable: false})
  descripcion!: string;

  @Property({nullable: false})
  direccion!: string;

  @Property({nullable: false})
  horario?: string;

  @Property({nullable: false})
  sitioWeb?: string;

  @Property({nullable: false})
  telContacto?: string;

  //CAMBIAR CUANDO ESTE EL CRUD DE LUGAR
  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Rel<Lugar>;

}