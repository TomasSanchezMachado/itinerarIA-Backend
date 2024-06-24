import { AbstractSchemaGenerator, type CreateSchemaOptions, type MikroORM } from '@mikro-orm/core';
import type { MongoDriver } from './MongoDriver';
export declare class MongoSchemaGenerator extends AbstractSchemaGenerator<MongoDriver> {
    static register(orm: MikroORM): void;
    createSchema(options?: MongoCreateSchemaOptions): Promise<void>;
    dropSchema(options?: {
        dropMigrationsTable?: boolean;
    }): Promise<void>;
    updateSchema(options?: MongoCreateSchemaOptions): Promise<void>;
    ensureDatabase(): Promise<boolean>;
    refreshDatabase(options?: MongoCreateSchemaOptions): Promise<void>;
    dropIndexes(options?: {
        skipIndexes?: {
            collection: string;
            indexName: string;
        }[];
        collectionsWithFailedIndexes?: string[];
    }): Promise<void>;
    ensureIndexes(options?: EnsureIndexesOptions): Promise<void>;
    private createIndexes;
    private createUniqueIndexes;
    private createPropertyIndexes;
}
export interface MongoCreateSchemaOptions extends CreateSchemaOptions {
    /** create indexes? defaults to true */
    ensureIndexes?: boolean;
}
export interface EnsureIndexesOptions {
    ensureCollections?: boolean;
    retry?: boolean | string[];
    retryLimit?: number;
}
