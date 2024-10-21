import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ExternalService } from "../externalService/externalService.entity.js";
import { Activity } from "../activity/activity.entity.js";
import { Itinerary } from "../itinerary/itinerary.entity.js";


@Entity()
export class Lugar extends BaseEntity {

    @Property()
    nombre!: string

    @Property()
    ubicacion_latitud!: number

    @Property()
    ubicacion_longitud!: number

    @Property()
    codigoPostal!: string

    @Property()
    provincia!: string

    @Property()
    pais!: string

    @OneToMany(() => ExternalService, (externalService) => externalService.lugar,
        { cascade: [Cascade.ALL] })
    externalServices = new Collection<ExternalService>(this)

    @OneToMany(() => Activity, (activity) => activity.place,
        { cascade: [Cascade.ALL] })
    activities = new Collection<Activity>(this)

    @OneToMany(() => Itinerary, (itinerario) => itinerario.place,
        { cascade: [Cascade.ALL] }) 
    itinerarios = new Collection<Itinerary>(this)

}