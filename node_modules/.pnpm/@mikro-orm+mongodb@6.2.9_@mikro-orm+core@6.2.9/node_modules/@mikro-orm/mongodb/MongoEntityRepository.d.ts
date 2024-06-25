import { EntityRepository, type EntityName } from '@mikro-orm/core';
import type { Collection } from 'mongodb';
import type { MongoEntityManager } from './MongoEntityManager';
export declare class MongoEntityRepository<T extends object> extends EntityRepository<T> {
    protected readonly em: MongoEntityManager;
    constructor(em: MongoEntityManager, entityName: EntityName<T>);
    /**
     * Shortcut to driver's aggregate method. Available in MongoDriver only.
     */
    aggregate(pipeline: any[]): Promise<any[]>;
    getCollection(): Collection<T>;
    /**
     * @inheritDoc
     */
    getEntityManager(): MongoEntityManager;
}
