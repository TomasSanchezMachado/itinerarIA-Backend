import {Entity,  ManyToOne,  Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Place } from "../place/place.entity.js";

export enum ExternalServiceStatus {
  Pending = 'PENDING',
  Active = 'ACTIVE',
  Canceled = 'CANCELED'
}

@Entity()
export class ExternalService extends BaseEntity{

  @Property({ nullable: false, default: ExternalServiceStatus.Pending })
  status: string = ExternalServiceStatus.Pending;

  @Property({nullable: false})
  serviceType!: string;

  @Property({nullable: false, unique: true})
  name!: string;
 
  @Property({nullable: false})
  description!: string;

  @Property({nullable: false})
  address!: string;

  @Property({ nullable: true })
  schedule?: string;

  @Property({nullable: true})
  website?: string;

  @Property({nullable: true})
  phoneNumber?: string;

  @ManyToOne(() => Place, { nullable: false })
  place!: Rel<Place>;

}