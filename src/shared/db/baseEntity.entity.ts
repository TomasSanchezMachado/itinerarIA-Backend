import { PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";


export abstract class BaseEntity {

  @PrimaryKey()
<<<<<<< HEAD
  _id?: ObjectId;

  @SerializedPrimaryKey()
  id?: string;
=======
  _id?: ObjectId = new ObjectId();

  @SerializedPrimaryKey()
  id!: string;

    /*

  @Property({ type: DateTimeType })
  createdAt? = new Date()

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date(),
  })
  updatedAt? = new Date()

  */
>>>>>>> b8bf670be0ddaf37f7c056c9b2cfc7eacd50528c


}