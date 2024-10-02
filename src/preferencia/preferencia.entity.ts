import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Entity, Property, ManyToMany, Rel, OneToMany, Collection } from '@mikro-orm/core';
import { Participante } from "../participante/participante.entity.js";
import { Itinerary } from "../itinerary/itinerary.entity.js";

@Entity()
export class Preferencia extends BaseEntity{

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;

  @ManyToMany(() => Participante, )
  participante!: Rel<Participante>;
}