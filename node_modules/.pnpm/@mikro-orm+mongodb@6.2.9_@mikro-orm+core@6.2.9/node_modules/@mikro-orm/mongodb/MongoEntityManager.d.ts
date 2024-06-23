import { EntityManager, type EntityName, type EntityRepository, type GetRepository, type TransactionOptions } from '@mikro-orm/core';
import type { Collection, Document, TransactionOptions as MongoTransactionOptions } from 'mongodb';
import type { MongoDriver } from './MongoDriver';
import type { MongoEntityRepository } from './MongoEntityRepository';
/**
 * @inheritDoc
 */
export declare class MongoEntityManager<Driver extends MongoDriver = MongoDriver> extends EntityManager<Driver> {
    /**
     * Shortcut to driver's aggregate method. Available in MongoDriver only.
     */
    aggregate(entityName: EntityName<any>, pipeline: any[]): Promise<any[]>;
    getCollection<T extends Document>(entityName: EntityName<T>): Collection<T>;
    /**
     * @inheritDoc
     */
    getRepository<T extends object, U extends EntityRepository<T> = MongoEntityRepository<T>>(entityName: EntityName<T>): GetRepository<T, U>;
    /**
     * @inheritDoc
     */
    begin(options?: Omit<TransactionOptions, 'ignoreNestedTransactions'> & MongoTransactionOptions): Promise<void>;
    /**
     * @inheritDoc
     */
    transactional<T>(cb: (em: this) => Promise<T>, options?: TransactionOptions & MongoTransactionOptions): Promise<T>;
}
