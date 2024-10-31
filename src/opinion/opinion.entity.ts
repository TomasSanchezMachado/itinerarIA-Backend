import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { User } from '../user/user.entity.js';
import { Activity } from '../activity/activity.entity.js';

@Entity()
export class Opinion extends BaseEntity {
  @Property({ nullable: false })
  rating!: number;

  @Property({ nullable: false })
  comment!: string;

  @ManyToOne(() => User, { nullable: false })
  user!: Rel<User>;

  @ManyToOne(() => Activity, { nullable: false })
  activity!: Rel<Activity>;
}

