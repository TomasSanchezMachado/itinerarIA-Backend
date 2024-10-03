var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Entity, Property, ManyToMany } from '@mikro-orm/core';
import { Participant } from "../participant/participant.entity.js";
export let Preferencia = class Preferencia extends BaseEntity {
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Preferencia.prototype, "nombre", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Preferencia.prototype, "descripcion", void 0);
__decorate([
    ManyToMany(() => Participant),
    __metadata("design:type", Object)
], Preferencia.prototype, "participante", void 0);
Preferencia = __decorate([
    Entity()
], Preferencia);
//# sourceMappingURL=preferencia.entity.js.map