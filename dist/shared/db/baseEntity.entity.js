var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
export class BaseEntity {
    constructor() {
        this._id = new ObjectId();
        /*
    
      @Property({ type: DateTimeType })
      createdAt? = new Date()
    
      @Property({
        type: DateTimeType,
        onUpdate: () => new Date(),
      })
      updatedAt? = new Date()
    
      */
    }
}
__decorate([
    PrimaryKey(),
    __metadata("design:type", ObjectId)
], BaseEntity.prototype, "_id", void 0);
__decorate([
    SerializedPrimaryKey(),
    __metadata("design:type", String)
], BaseEntity.prototype, "id", void 0);
//# sourceMappingURL=baseEntity.entity.js.map