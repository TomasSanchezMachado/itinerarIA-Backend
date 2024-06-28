import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ServicioExterno } from "../servicioExterno/servicioExterno.entity.js";
import { Actividad } from "../actividad/actividad.entity.js";

type CoordenadasGeograficas = {
    latitud: number,
    longitud: number,
}

@Entity()
export class Lugar extends BaseEntity{

    @Property()
    nombre!: string

    @Property()
    ubicacion!: CoordenadasGeograficas

    @Property()
    codigoPostal!: string

    @Property()
    provincia!: string

    @Property()
    pais!: string

    @OneToMany(() => ServicioExterno, (servicioExterno) => servicioExterno.lugar,
        { cascade: [Cascade.ALL]})
    serviciosExternos = new Collection<ServicioExterno>(this)

    @OneToMany(() => Actividad, (actividad) => actividad.lugar,
        { cascade: [Cascade.ALL]})
    actividades = new Collection<Actividad>(this)
        
}