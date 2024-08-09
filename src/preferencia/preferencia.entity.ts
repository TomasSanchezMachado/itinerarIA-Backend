
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Entity, Property, ManyToMany, Rel } from '@mikro-orm/core';
import { Participante } from "../participante/participante.entity.js";

@Entity()
export class Preferencia extends BaseEntity{

    @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;

  @ManyToMany(() => Participante, )
  participante!: Rel<Participante>;

}