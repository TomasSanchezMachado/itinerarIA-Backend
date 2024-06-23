import { PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from '@mikro-orm/mongodb';

export class ServicioExterno {
  @PrimaryKey()
  _id?: ObjectId = new ObjectId();

  @SerializedPrimaryKey()
  id?: string;

}