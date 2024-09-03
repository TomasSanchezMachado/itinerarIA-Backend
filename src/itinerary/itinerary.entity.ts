import { Actividad } from '../actividad/actividad.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'
import { Property,OneToMany, Collection, Entity, ManyToOne, Cascade } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Participante } from '../participante/participante.entity.js'

@Entity()
export class Itinerary extends BaseEntity{
        @Property({nullable:false}) 
        title!: string
        
        @Property({nullable:false}) 
        description!: string
        
        @Property({nullable:false}) 
        duration!: number
    
        @OneToMany(() => Actividad, (activity) => activity.itinerario, {cascade: [Cascade.ALL]}) 
        activities = new Collection<Actividad>(this)

        @ManyToOne(() => Usuario, {nullable : false})
        user! : Usuario

        @OneToMany(() => Participante, (participant) => participant.itinerario, {cascade: [Cascade.ALL]})
        participants = new Collection<Participante>(this)
}
