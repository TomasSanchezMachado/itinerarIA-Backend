var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { ExternalService } from "../externalService/externalService.entity.js";
import { Activity } from "../activity/activity.entity.js";
import { Itinerary } from "../itinerary/itinerary.entity.js";
export let Lugar = class Lugar extends BaseEntity {
    constructor() {
        super(...arguments);
        this.externalServices = new Collection(this);
        this.activities = new Collection(this);
        this.itinerarios = new Collection(this);
    }
};
__decorate([
    Property(),
    __metadata("design:type", String)
], Lugar.prototype, "nombre", void 0);
__decorate([
    Property(),
    __metadata("design:type", Number)
], Lugar.prototype, "ubicacion_latitud", void 0);
__decorate([
    Property(),
    __metadata("design:type", Number)
], Lugar.prototype, "ubicacion_longitud", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Lugar.prototype, "codigoPostal", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Lugar.prototype, "provincia", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Lugar.prototype, "pais", void 0);
__decorate([
    OneToMany(() => ExternalService, (externalService) => externalService.lugar, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Lugar.prototype, "externalServices", void 0);
__decorate([
    OneToMany(() => Activity, (activity) => activity.place, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Lugar.prototype, "activities", void 0);
__decorate([
    OneToMany(() => Itinerary, (itinerario) => itinerario.place, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Lugar.prototype, "itinerarios", void 0);
Lugar = __decorate([
    Entity()
], Lugar);
//# sourceMappingURL=lugar.entity.js.map