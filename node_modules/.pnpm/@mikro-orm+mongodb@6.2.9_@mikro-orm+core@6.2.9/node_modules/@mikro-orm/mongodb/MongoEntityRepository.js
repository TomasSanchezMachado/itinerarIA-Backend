"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoEntityRepository = void 0;
const core_1 = require("@mikro-orm/core");
class MongoEntityRepository extends core_1.EntityRepository {
    em;
    constructor(em, entityName) {
        super(em, entityName);
        this.em = em;
    }
    /**
     * Shortcut to driver's aggregate method. Available in MongoDriver only.
     */
    async aggregate(pipeline) {
        return this.getEntityManager().aggregate(this.entityName, pipeline);
    }
    getCollection() {
        return this.getEntityManager().getCollection(this.entityName);
    }
    /**
     * @inheritDoc
     */
    getEntityManager() {
        return this.em;
    }
}
exports.MongoEntityRepository = MongoEntityRepository;
