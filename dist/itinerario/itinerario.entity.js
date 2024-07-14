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
let Itinerario = class Itinerario extends BaseEntity {
    constructor() {
        super(...arguments);
        this.actividades = new Collection(this);
        this.participantes = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Itinerario.prototype, "titulo", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Itinerario.prototype, "descripcion", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Itinerario.prototype, "cantDias", void 0);
__decorate([
    OneToMany(() => Actividad, (actividades) => actividades.itinerario),
    __metadata("design:type", Object)
], Itinerario.prototype, "actividades", void 0);
__decorate([
    ManyToOne(() => Usuario, { nullable: false }),
    __metadata("design:type", Object)
], Itinerario.prototype, "usuario", void 0);
__decorate([
    OneToMany(() => Participante, (participante) => participante.itinerario, { cascade: [Cascade.ALL] }),
    __metadata("design:type", Object)
], Itinerario.prototype, "participantes", void 0);
Itinerario = __decorate([
    Entity()
], Itinerario);
export { Itinerario };
//# sourceMappingURL=itinerario.entity.js.map