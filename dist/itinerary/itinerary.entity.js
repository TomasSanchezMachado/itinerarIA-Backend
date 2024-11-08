var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Activity } from '../activity/activity.entity.js';
import { User } from '../user/user.entity.js';
import { Property, OneToMany, Collection, Entity, ManyToOne, Cascade, ManyToMany } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Participant } from '../participant/participant.entity.js';
import { Place } from '../place/place.entity.js';
export let Itinerary = class Itinerary extends BaseEntity {
    constructor() {
        super(...arguments);
        this.activities = new Collection(this);
        this.participants = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Itinerary.prototype, "title", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Itinerary.prototype, "description", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Date)
], Itinerary.prototype, "dayStart", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Date)
], Itinerary.prototype, "dayEnd", void 0);
__decorate([
    OneToMany(() => Activity, (activity) => activity.itinerary, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Itinerary.prototype, "activities", void 0);
__decorate([
    ManyToOne(() => User, { nullable: false }),
    __metadata("design:type", User)
], Itinerary.prototype, "user", void 0);
__decorate([
    ManyToMany(() => Participant, (participant) => participant.itineraries, { owner: true, cascade: [Cascade.CANCEL_ORPHAN_REMOVAL], nullable: false }),
    __metadata("design:type", Object)
], Itinerary.prototype, "participants", void 0);
__decorate([
    ManyToOne(() => Place, { nullable: false }),
    __metadata("design:type", Object)
], Itinerary.prototype, "place", void 0);
Itinerary = __decorate([
    Entity()
], Itinerary);
//# sourceMappingURL=itinerary.entity.js.map