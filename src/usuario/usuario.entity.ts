import { Itinerario } from '../itinerario/itinerario.entity.js'
//import {Opinion} from '../opinion/opinion.entity.js'
import { Entity, OneToMany, Property, Cascade, Collection, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Usuario extends BaseEntity {
    @Property({ nullable: false, unique: true })
    nombreDeUsuario!: string

    @Property({ nullable: false })
    nombres!: string

    @Property({ nullable: false })
    apellidos!: string

    @Property({ nullable: false })
    fechaNacimiento!: Date

    @Property({ nullable: false, unique: true })
    mail!: string

    @Property({ nullable: false })
    nroTelefono!: string

    @OneToMany(() => Itinerario, itinerario => itinerario.usuario, { cascade: [Cascade.ALL] }) // OJO!! Es cero o uno a muchos
    itinerarios = new Collection<Itinerario>(this);

    /* @OneToMany(() => Opinion, (opinion) => opinion.usuario, {cascade : [Cascade.ALL]})
     opiniones = new Collection <Opinion> (this)*/
}