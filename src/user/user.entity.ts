import { Itinerary } from '../itinerary/itinerary.entity.js'
import { Opinion } from '../opinion/opinion.entity.js'
import { Entity, OneToMany, Property, Cascade, Collection, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Participant } from '../participant/participant.entity.js';

@Entity()
export class User extends BaseEntity {
    @Property({ nullable: false, unique: true })
    username!: string

    @Property({ nullable: false })
    password!:string

    @Property({ nullable: false })
    names!: string

    @Property({ nullable: false })
    lastNames!: string

    @Property({ nullable: false })
    dateOfBirth!: Date

    @Property({ nullable: false, unique: true })
    mail!: string

    @Property({ nullable: false })
    phoneNumber!: string

    @OneToMany(() => Itinerary, itinerary => itinerary.user, { cascade: [Cascade.ALL] })
    itineraries = new Collection<Itinerary>(this);

    @OneToMany(() => Participant, participant => participant.user, { cascade: [Cascade.ALL] })
    participants = new Collection<Participant>(this);

    @OneToMany(() => Opinion, (opinion) => opinion.user, { cascade: [Cascade.ALL] })
    opinions = new Collection<Opinion>(this)
}