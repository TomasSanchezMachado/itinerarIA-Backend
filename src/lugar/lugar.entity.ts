import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ServicioExterno } from "../servicioExterno/servicioExterno.entity.js";
import { Actividad } from "../actividad/actividad.entity.js";
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

    @OneToMany(() => ServicioExterno, (servicioExterno) => servicioExterno.lugar,
        { cascade: [Cascade.ALL] })
    serviciosExternos = new Collection<ServicioExterno>(this)

    @OneToMany(() => Actividad, (actividad) => actividad.place,
        { cascade: [Cascade.ALL] })
    actividades = new Collection<Actividad>(this)

    @OneToMany(() => Itinerary, (itinerario) => itinerario.place,
        { cascade: [Cascade.ALL] }) 
    itinerarios = new Collection<Itinerary>(this)

}