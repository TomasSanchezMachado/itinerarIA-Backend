var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Itinerario } from '../itinerario/itinerario.entity.js';
import { Opinion } from '../opinion/opinion.entity.js';
import { Entity, OneToMany, Property, Cascade, Collection, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
export let Usuario = class Usuario extends BaseEntity {
    constructor() {
        super(...arguments);
        this.itinerarios = new Collection(this);
        this.opiniones = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "nombreDeUsuario", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "nombres", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "apellidos", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Date)
], Usuario.prototype, "fechaNacimiento", void 0);
__decorate([
    Property({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Usuario.prototype, "mail", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "nroTelefono", void 0);
__decorate([
    OneToMany(() => Itinerario, itinerario => itinerario.usuario, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Usuario.prototype, "itinerarios", void 0);
__decorate([
    OneToMany(() => Opinion, (opinion) => opinion.usuario, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Usuario.prototype, "opiniones", void 0);
Usuario = __decorate([
    Entity()
], Usuario);
//# sourceMappingURL=usuario.entity.js.map