import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ExternalService } from "../externalService/externalService.entity.js";
import { Activity } from "../activity/activity.entity.js";
import { Itinerary } from "../itinerary/itinerary.entity.js";


@Entity()
export class Place extends BaseEntity {

    @Property()
    name!: string

    @Property()
    latitude!: number

    @Property()
    longitude!: number

    @Property()
    zipCode!: string

    @Property()
    province!: string

    @Property()
    country!: string

    @OneToMany(() => ExternalService, (externalService) => externalService.lugar,
        { cascade: [Cascade.ALL] })
    externalServices = new Collection<ExternalService>(this)

    @OneToMany(() => Activity, (activity) => activity.place,
        { cascade: [Cascade.ALL] })
    activities = new Collection<Activity>(this)

    @OneToMany(() => Itinerary, (itinerary) => itinerary.place,
        { cascade: [Cascade.ALL] }) 
    itineraries = new Collection<Itinerary>(this)

}