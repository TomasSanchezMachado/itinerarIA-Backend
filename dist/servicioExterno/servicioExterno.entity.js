var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Lugar } from "../lugar/lugar.entity.js";
let ServicioExterno = class ServicioExterno extends BaseEntity {
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], ServicioExterno.prototype, "tipoServicio", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], ServicioExterno.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], ServicioExterno.prototype, "descripcion", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], ServicioExterno.prototype, "direccion", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], ServicioExterno.prototype, "horario", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], ServicioExterno.prototype, "sitioWeb", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], ServicioExterno.prototype, "telContacto", void 0);
__decorate([
    ManyToOne(() => Lugar, { nullable: false }),
    __metadata("design:type", Object)
], ServicioExterno.prototype, "lugar", void 0);
ServicioExterno = __decorate([
    Entity()
], ServicioExterno);
export { ServicioExterno };
//# sourceMappingURL=servicioExterno.entity.js.map