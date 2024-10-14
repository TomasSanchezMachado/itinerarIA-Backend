var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Itinerary } from '../itinerary/itinerary.entity.js';
import { Property, Entity, ManyToOne, ManyToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Preference } from '../preference/preference.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
export let Participant = class Participant extends BaseEntity {
    constructor() {
        super(...arguments);
        this.itineraries = new Collection(this);
        this.preferences = new Collection(this);
    }
};
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Participant.prototype, "name", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Participant.prototype, "age", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Boolean)
], Participant.prototype, "disability", void 0);
__decorate([
    ManyToMany(() => Itinerary, (itinerary) => itinerary.participants, { nullable: true }),
    __metadata("design:type", Object)
], Participant.prototype, "itineraries", void 0);
__decorate([
    ManyToMany(() => Preference, (preference) => preference.participants, { owner: true }),
    __metadata("design:type", Object)
], Participant.prototype, "preferences", void 0);
__decorate([
    ManyToOne(() => Usuario, { nullable: true }),
    __metadata("design:type", Object)
], Participant.prototype, "user", void 0);
Participant = __decorate([
    Entity()
], Participant);
//# sourceMappingURL=participant.entity.js.map