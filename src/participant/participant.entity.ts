import { Itinerary } from "../itinerary/itinerary.entity.js";
import {
  Property,
  Entity,
  ManyToOne,
  Rel,
  ManyToMany,
  Collection,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Preference } from "../preference/preference.entity.js";
import { User } from "../user/user.entity.js";

@Entity()
export class Participant extends BaseEntity {
  @Property({ nullable: true })
  name?: string;

  @Property({ nullable: false })
  age!: number;

  @Property({ nullable: false })
  disability!: boolean;

  @ManyToMany(() => Itinerary, (itinerary) => itinerary.participants, {
    nullable: true,
  })
  itineraries = new Collection<Itinerary>(this);

  @ManyToMany(() => Preference, (preference) => preference.participants, {
    owner: true,
  })
  preferences = new Collection<Preference>(this);

  @ManyToOne(() => User, { nullable: true })
  user?: Rel<User>;
}
