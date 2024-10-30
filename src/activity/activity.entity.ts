
import { Entity, Property, OneToMany, ManyToOne, Collection, Cascade, Rel} from '@mikro-orm/core';
import { Place } from "../place/place.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Itinerary } from '../itinerary/itinerary.entity.js';
import { Opinion } from '../opinion/opinion.entity.js';

@Entity()
export class Activity extends BaseEntity{

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

  @ManyToOne(() => Place, {nullable: false})
  place!: Rel<Place>;

  @ManyToOne(() => Itinerary,{nullable:false})
  itinerary!: Rel<Itinerary>
  
  @OneToMany(() => Opinion, (opinion) => opinion.activity, { cascade: [Cascade.ALL] })
  opinions = new Collection<Opinion>(this)

}

