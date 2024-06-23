import { MikroORM } from "@mikro-orm/core";

export const orm = await MikroORM.init({
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: 'my-db-name',