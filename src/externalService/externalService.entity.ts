import {Entity,  ManyToOne,  Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Lugar } from "../lugar/lugar.entity.js";

@Entity()
export class ExternalService extends BaseEntity{

  @Property({nullable: false})
  serviceType!: string;

  @Property({nullable: false, unique: true})
  name!: string;
 
  @Property({nullable: false})
  description!: string;

  @Property({nullable: false})
  adress!: string;

  @Property({nullable: false})
  schedule?: string;

  @Property({nullable: true})
  website?: string;

  @Property({nullable: true})
  phoneNumber?: string;

  @ManyToOne(() => Lugar, { nullable: false })
  lugar!: Rel<Lugar>;

}