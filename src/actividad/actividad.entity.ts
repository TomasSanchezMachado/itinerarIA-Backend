
import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { Lugar } from "../lugar/lugar.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Itinerario } from '../itinerario/itinerario.entity.js';

@Entity()
export class Actividad extends BaseEntity {

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;

  @Property({ nullable: false })
  aireLibre!: boolean;

  @Property()
  transporte?: string;

  @Property({ nullable: false })
  horario!: string;

  // @Property()
  // fecha?: string;

  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Rel<Lugar>;

  @ManyToOne(() => Itinerario, { nullable: false })
  itinerario!: Rel<Lugar>;

}

