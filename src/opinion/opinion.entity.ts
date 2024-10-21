import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Usuario } from '../usuario/usuario.entity.js';
import { Activity } from '../activity/activity.entity.js';

@Entity()
export class Opinion extends BaseEntity {
  @Property({ nullable: false })
  calificacion!: number;

  @Property({ nullable: false })
  comentario!: string;

  @ManyToOne(() => Usuario, { nullable: false })
  usuario!: Rel<Usuario>;

  @ManyToOne(() => Activity, { nullable: false })
  activity!: Rel<Activity>;
}

