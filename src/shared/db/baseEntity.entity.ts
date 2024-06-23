import { PrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";


export abstract class BaseEntity {

  @PrimaryKey()
  id!: ObjectId;

}