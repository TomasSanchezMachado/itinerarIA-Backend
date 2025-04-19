import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import "dotenv/config.js";
import { MONGO_URI_RAILWAY, DB_NAME } from "../../config.js";


if (process.env.NODE_ENV === "test") {
  console.log("Using test database,", DB_NAME);
}

export const orm = await MikroORM.init({
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  dbName: DB_NAME, // Usa la BD de testing si estamos en test
  type: "mongo",
  clientUrl: MONGO_URI_RAILWAY,
  //cambiar a la linea de abajo para usar docker compose
  //clientUrl: `mongodb://${mongoUsername}:${mongoPassword}@mongo-db:27017`,
  //clientUrl: `mongodb://${mongoUsername}:${mongoPassword}@localhost:27017/`,
  highlighter: new MongoHighlighter(),
  debug: true,
  schemaGenerator: {
    //no es para mongo
    //never in production
    disableForeignKeys: true,
    createForeignKeyConstraints: true,
    ignoreSchema: [],
  },
});

export const syncSchema = async () => {
  const generator = orm.getSchemaGenerator();

  //await generator.dropSchema()
  //await generator.createSchema()

  await generator.updateSchema();
};
