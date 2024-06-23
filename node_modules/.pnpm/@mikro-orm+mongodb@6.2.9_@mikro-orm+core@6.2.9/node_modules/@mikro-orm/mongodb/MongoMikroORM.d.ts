import { MikroORM, type Options, type IDatabaseDriver, type EntityManager, type EntityManagerType } from '@mikro-orm/core';
import { MongoDriver } from './MongoDriver';
import type { MongoEntityManager } from './MongoEntityManager';
/**
 * @inheritDoc
 */
export declare class MongoMikroORM<EM extends EntityManager = MongoEntityManager> extends MikroORM<MongoDriver, EM> {
    private static DRIVER;
    /**
     * @inheritDoc
     */
    static init<D extends IDatabaseDriver = MongoDriver, EM extends EntityManager = D[typeof EntityManagerType] & EntityManager>(options?: Options<D, EM>): Promise<MikroORM<D, EM>>;
    /**
     * @inheritDoc
     */
    static initSync<D extends IDatabaseDriver = MongoDriver, EM extends EntityManager = D[typeof EntityManagerType] & EntityManager>(options: Options<D, EM>): MikroORM<D, EM>;
}
export type MongoOptions = Options<MongoDriver>;
export declare function defineMongoConfig(options: MongoOptions): Options<MongoDriver, MongoEntityManager<MongoDriver> & EntityManager<IDatabaseDriver<import("@mikro-orm/core").Connection>>>;
