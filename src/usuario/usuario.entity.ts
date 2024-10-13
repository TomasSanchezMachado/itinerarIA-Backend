import { Itinerary } from '../itinerary/itinerary.entity.js'
import { Opinion } from '../opinion/opinion.entity.js'
import { Entity, OneToMany, Property, Cascade, Collection, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Participant } from '../participant/participant.entity.js';

@Entity()
export class Usuario extends BaseEntity {
    @Property({ nullable: false, unique: true })
    username!: string

    @Property({ nullable: false })
    password!:string

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

    @OneToMany(() => Itinerary, itinerary => itinerary.user, { cascade: [Cascade.ALL] })
    itineraries = new Collection<Itinerary>(this);

    @OneToMany(() => Participant, participant => participant.user, { cascade: [Cascade.ALL] })
    participants = new Collection<Participant>(this);

    @OneToMany(() => Opinion, (opinion) => opinion.usuario, { cascade: [Cascade.ALL] })
    opiniones = new Collection<Opinion>(this)
}