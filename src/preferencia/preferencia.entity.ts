import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Entity, Property, ManyToMany, Rel, OneToMany, Collection } from '@mikro-orm/core';
import { Participant } from "../participant/participant.entity.js";
import { Itinerary } from "../itinerary/itinerary.entity.js";

@Entity()
export class Preferencia extends BaseEntity {

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;

  @ManyToMany(() => Participant,)
  participante!: Rel<Participant>;
}