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
import { ServicioExterno } from "../servicioExterno/servicioExterno.entity.js";
let Lugar = class Lugar extends BaseEntity {
    constructor() {
        super(...arguments);
        this.serviciosExternos = new Collection(this);
    }
};
__decorate([
    Property(),
    __metadata("design:type", String)
], Lugar.prototype, "nombre", void 0);
__decorate([
    Property(),
    __metadata("design:type", Object)
], Lugar.prototype, "ubicacion", void 0);
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
    OneToMany(() => ServicioExterno, servicioExterno => servicioExterno.lugar, { cascade: [Cascade.ALL], }),
    __metadata("design:type", Object)
], Lugar.prototype, "serviciosExternos", void 0);
Lugar = __decorate([
    Entity()
], Lugar);
export { Lugar };
//# sourceMappingURL=lugar.entity.js.map