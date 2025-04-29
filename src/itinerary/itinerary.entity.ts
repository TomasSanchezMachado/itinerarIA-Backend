import { Activity } from '../activity/activity.entity.js'
import { User } from '../user/user.entity.js'
import { Property, OneToMany, Collection, Entity, ManyToOne, Cascade, Rel, ManyToMany, DateType } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Participant } from '../participant/participant.entity.js'
import { Place } from '../place/place.entity.js'

@Entity()
export class Itinerary extends BaseEntity {
        @Property({ nullable: false })
        title!: string

        @Property({ nullable: false })
        description?: string

        @Property({ nullable: false })
        dayStart!: DateType

        @Property({ nullable: false })
        dayEnd!: DateType

        @OneToMany(() => Activity, (activity) => activity.itinerary, { cascade: [Cascade.ALL] })
        activities = new Collection<Activity>(this)

        @ManyToOne(() => User, { nullable: false })
        user!: User

        @ManyToMany(() => Participant, (participant) => participant.itineraries,{owner:true,cascade:[Cascade.CANCEL_ORPHAN_REMOVAL], nullable: false})
        participants = new Collection<Participant>(this)

        @ManyToOne(() => Place, { nullable: false })
        place!: Rel<Place>

}
