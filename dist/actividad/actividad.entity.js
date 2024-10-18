var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, OneToMany, ManyToOne, Collection, Cascade } from '@mikro-orm/core';
import { Lugar } from "../lugar/lugar.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Itinerary } from '../itinerary/itinerary.entity.js';
import { Opinion } from '../opinion/opinion.entity.js';
export let Actividad = class Actividad extends BaseEntity {
    constructor() {
        super(...arguments);
        this.opinions = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Actividad.prototype, "name", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Actividad.prototype, "description", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Boolean)
], Actividad.prototype, "outdoor", void 0);
__decorate([
    Property(),
    __metadata("design:type", Boolean)
], Actividad.prototype, "transport", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Actividad.prototype, "schedule", void 0);
__decorate([
    ManyToOne(() => Lugar, { nullable: false }),
    __metadata("design:type", Object)
], Actividad.prototype, "place", void 0);
__decorate([
    ManyToOne(() => Itinerary, { nullable: false }),
    __metadata("design:type", Object)
], Actividad.prototype, "itinerary", void 0);
__decorate([
    OneToMany(() => Opinion, (opinion) => opinion.actividad, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Actividad.prototype, "opinions", void 0);
Actividad = __decorate([
    Entity()
], Actividad);
//# sourceMappingURL=actividad.entity.js.map