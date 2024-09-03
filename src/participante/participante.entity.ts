import { Itinerary } from '../itinerary/itinerary.entity.js'
import { Property, Entity, ManyToOne, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Participante extends BaseEntity{
        @Property({nullable: false})
        edad! : number
        
        @Property({nullable:false})
        discapacidad! : boolean

        @ManyToOne(() => Itinerary,{nullable: false})
        itinerario! : Rel<Itinerary>
}
