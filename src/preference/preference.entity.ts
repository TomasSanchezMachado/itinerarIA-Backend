import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Entity, Property, ManyToMany, Rel, OneToMany, Collection, Cascade } from '@mikro-orm/core';
import { Participant } from "../participant/participant.entity.js";
import { Itinerary } from "../itinerary/itinerary.entity.js";

@Entity()
export class Preference extends BaseEntity {

  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  description!: string;

  // @ManyToMany(() => Participant,)
  // participante!: Rel<Participant>;
  
  @ManyToMany(() => Itinerary, (itinerary) => itinerary.preferences,)
  itineraries = new Collection<Itinerary>(this);//para mi la preferencia va en itinerarios, no en participantes.
}