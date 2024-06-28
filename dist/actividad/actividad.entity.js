var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import crypto from 'node:crypto';
let Actividad = class Actividad {
    constructor() {
        this.id = crypto.randomUUID();
        // @Property()
        // horario?: string;
        // @Property()
        // fecha?: string;
    }
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", ObjectId)
], Actividad.prototype, "_id", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Actividad.prototype, "nombre", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Actividad.prototype, "descripcion", void 0);
__decorate([
    Property(),
    __metadata("design:type", Boolean)
], Actividad.prototype, "aireLibre", void 0);
__decorate([
    Property(),
    __metadata("design:type", Object)
], Actividad.prototype, "id", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Actividad.prototype, "transporte", void 0);
Actividad = __decorate([
    Entity()
], Actividad);
export { Actividad };
// -Ver temas etiquetas (puede tener mas de una categoria?)
// -Ver temas de relaciones 
// type para la hora
// type para la fecha
// type para el transporte
//# sourceMappingURL=actividad.entity.js.map