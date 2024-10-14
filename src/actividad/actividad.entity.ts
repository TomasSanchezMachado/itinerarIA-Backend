
import { Entity, Property, OneToMany, ManyToOne, Collection, Cascade, Rel} from '@mikro-orm/core';
import { Lugar } from "../lugar/lugar.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Itinerary } from '../itinerary/itinerary.entity.js';
import { Opinion } from '../opinion/opinion.entity.js';

@Entity()
export class Actividad extends BaseEntity{

  @Property({nullable: false})
  name!: string;

  @Property({nullable: false})
  description!: string;

  @Property({nullable: false})
  outdoor!: boolean;

  @Property()
  transport?: boolean;

  @Property({nullable: false})
  schedule!: string;

  // @Property()
  // fecha?: string;

  @ManyToOne(() => Lugar, {nullable: false})
  place!: Rel<Lugar>;

  @ManyToOne(() => Itinerary,{nullable:false})
  itinerary!: Rel<Itinerary>
  
  @OneToMany(() => Opinion, opiniones => opiniones.actividad, {cascade: [Cascade.ALL]})
  opinions?: Opinion;

}

