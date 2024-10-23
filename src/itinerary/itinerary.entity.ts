import { Activity } from '../activity/activity.entity.js'
import { User } from '../user/user.entity.js'
import { Property, OneToMany, Collection, Entity, ManyToOne, Cascade, Rel, ManyToMany } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Participant } from '../participant/participant.entity.js'
import { Lugar } from '../lugar/lugar.entity.js'
import { Preference } from '../preference/preference.entity.js'

@Entity()
export class Itinerary extends BaseEntity {
        @Property({ nullable: false })
        title!: string

        @Property({ nullable: false })
        description!: string

        @Property({ nullable: false })
        duration!: number

        @OneToMany(() => Activity, (activity) => activity.itinerary, { cascade: [Cascade.ALL] })
        activities = new Collection<Activity>(this)

        @ManyToOne(() => User, { nullable: false })
        user!: User

        @ManyToMany(() => Participant, (participant) => participant.itineraries,{owner:true,cascade:[Cascade.CANCEL_ORPHAN_REMOVAL], nullable: false})
        participants = new Collection<Participant>(this)

        @ManyToOne(() => Lugar, { nullable: false })
        place!: Rel<Lugar>

}
