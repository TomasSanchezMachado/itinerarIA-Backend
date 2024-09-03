var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Actividad } from '../actividad/actividad.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { Property, OneToMany, Collection, Entity, ManyToOne, Cascade } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Participante } from '../participante/participante.entity.js';
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
    __metadata("design:type", Number)
], Itinerary.prototype, "duration", void 0);
__decorate([
    OneToMany(() => Actividad, (activity) => activity.itinerario, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Itinerary.prototype, "activities", void 0);
__decorate([
    ManyToOne(() => Usuario, { nullable: false }),
    __metadata("design:type", Usuario)
], Itinerary.prototype, "user", void 0);
__decorate([
    OneToMany(() => Participante, (participant) => participant.itinerario, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Itinerary.prototype, "participants", void 0);
Itinerary = __decorate([
    Entity()
], Itinerary);
//# sourceMappingURL=itinerary.entity.js.map