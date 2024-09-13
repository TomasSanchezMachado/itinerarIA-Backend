import {Entity,  ManyToOne,  Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Lugar } from "../lugar/lugar.entity.js";

@Entity()
export class ServicioExterno extends BaseEntity{

  @Property({nullable: false})
  tipoServicio!: string;

  @Property({nullable: false, unique: true})
  nombre!: string;
 
  @Property({nullable: false})
  descripcion!: string;

  @Property({nullable: false})
  direccion!: string;

  @Property({nullable: false})
  horario?: string;

  @Property({nullable: true})
  sitioWeb?: string;

  @Property({nullable: true})
  telContacto?: string;

  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Rel<Lugar>;

}