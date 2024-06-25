import type { ClientSession } from 'mongodb';
import { type Configuration, type CountOptions, DatabaseDriver, type EntityData, type EntityDictionary, type EntityField, EntityManagerType, type FilterQuery, type FindOneOptions, type FindOptions, type IDatabaseDriver, type NativeInsertUpdateManyOptions, type NativeInsertUpdateOptions, type PopulateOptions, type PopulatePath, type QueryResult, type Transaction, type UpsertManyOptions, type UpsertOptions } from '@mikro-orm/core';
import { MongoConnection } from './MongoConnection';
import { MongoPlatform } from './MongoPlatform';
import { MongoEntityManager } from './MongoEntityManager';
export declare class MongoDriver extends DatabaseDriver<MongoConnection> {
    [EntityManagerType]: MongoEntityManager<this>;
    protected readonly connection: MongoConnection;
    protected readonly platform: MongoPlatform;
    constructor(config: Configuration);
    createEntityManager<D extends IDatabaseDriver = IDatabaseDriver>(useContext?: boolean): D[typeof EntityManagerType];
    find<T extends object, P extends string = never, F extends string = '*', E extends string = never>(entityName: string, where: FilterQuery<T>, options?: FindOptions<T, P, F, E>): Promise<EntityData<T>[]>;
    findOne<T extends object, P extends string = never, F extends string = PopulatePath.ALL, E extends string = never>(entityName: string, where: FilterQuery<T>, options?: FindOneOptions<T, P, F, E>): Promise<EntityData<T> | null>;
    findVirtual<T extends object>(entityName: string, where: FilterQuery<T>, options: FindOptions<T, any, any, any>): Promise<EntityData<T>[]>;
    count<T extends object>(entityName: string, where: FilterQuery<T>, options?: CountOptions<T>, ctx?: Transaction<ClientSession>): Promise<number>;
    nativeInsert<T extends object>(entityName: string, data: EntityDictionary<T>, options?: NativeInsertUpdateOptions<T>): Promise<QueryResult<T>>;
    nativeInsertMany<T extends object>(entityName: string, data: EntityDictionary<T>[], options?: NativeInsertUpdateManyOptions<T>): Promise<QueryResult<T>>;
    nativeUpdate<T extends object>(entityName: string, where: FilterQuery<T>, data: EntityDictionary<T>, options?: NativeInsertUpdateOptions<T> & UpsertOptions<T>): Promise<QueryResult<T>>;
    nativeUpdateMany<T extends object>(entityName: string, where: FilterQuery<T>[], data: EntityDictionary<T>[], options?: NativeInsertUpdateOptions<T> & UpsertManyOptions<T>): Promise<QueryResult<T>>;
    nativeDelete<T extends object>(entityName: string, where: FilterQuery<T>, options?: {
        ctx?: Transaction<ClientSession>;
    }): Promise<QueryResult<T>>;
    aggregate(entityName: string, pipeline: any[], ctx?: Transaction<ClientSession>): Promise<any[]>;
    getPlatform(): MongoPlatform;
    private renameFields;
    private convertObjectIds;
    private buildFilterById;
    protected buildFields<T extends object, P extends string = never>(entityName: string, populate: PopulateOptions<T>[], fields?: readonly EntityField<T, P>[], exclude?: string[]): string[] | undefined;
}
