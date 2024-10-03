import { Itinerary } from '../itinerary/itinerary.entity.js'
import { Property, Entity, ManyToOne, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'

@Entity()
export class Participant extends BaseEntity {
        @Property({ nullable: false })
        name!: string

        @Property({ nullable: false })
        age!: number

        @Property({ nullable: false })
        disability!: boolean

        @ManyToOne(() => Itinerary, { nullable: false })
        itinerary!: Rel<Itinerary>
}
