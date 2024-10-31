var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { User } from '../user/user.entity.js';
import { Activity } from '../activity/activity.entity.js';
export let Opinion = class Opinion extends BaseEntity {
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Opinion.prototype, "rating", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Opinion.prototype, "comment", void 0);
__decorate([
    ManyToOne(() => User, { nullable: false }),
    __metadata("design:type", Object)
], Opinion.prototype, "user", void 0);
__decorate([
    ManyToOne(() => Activity, { nullable: false }),
    __metadata("design:type", Object)
], Opinion.prototype, "activity", void 0);
Opinion = __decorate([
    Entity()
], Opinion);
//# sourceMappingURL=opinion.entity.js.map