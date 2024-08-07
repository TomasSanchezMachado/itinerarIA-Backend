import { Actividad } from '../actividad/actividad.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { Property, OneToMany, Collection, Entity, ManyToOne, Cascade, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Participante } from '../participante/participante.entity.js'

@Entity()
export class Itinerario extends BaseEntity {
        @Property({ nullable: false })
        titulo!: string

        @Property({ nullable: false })
        descripcion!: string

        @Property({ nullable: false })
        cantDias!: number

        @OneToMany(() => Actividad, (actividades) => actividades.itinerario)
        actividades = new Collection<Actividad>(this)

        @ManyToOne(() => Usuario, { nullable: false })
        usuario!: Usuario

        @OneToMany(() => Participante, (participante) => participante.itinerario, { cascade: [Cascade.ALL] })
        participantes = new Collection<Participante>(this)
}
