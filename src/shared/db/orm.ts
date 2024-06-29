import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";

export const orm = await MikroORM.init({
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: 'itinerarIA',
  type: 'mongo',
  clientUrl: 'mongodb://localhost:27017',
  highlighter: new MongoHighlighter(),
  debug: true,
  schemaGenerator: { //no es para mongo
    //never in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  }
});