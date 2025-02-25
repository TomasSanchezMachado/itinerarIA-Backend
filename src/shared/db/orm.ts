import { MikroORM } from "@mikro-orm/core";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";

const mongoUsername = process.env.MONGO_INITDB_ROOT_USERNAME || "root";
const mongoPassword = process.env.MONGO_INITDB_ROOT_PASSWORD || "example";

const dbName =
  process.env.NODE_ENV === "test" ? "itinerarIA_test" : "itinerarIA";

if(process.env.NODE_ENV === "test"){
  console.log("Using test database,", dbName);
}

export const orm = await MikroORM.init({
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  dbName: dbName, // Usa la BD de testing si estamos en test
  type: "mongo",
  clientUrl: `mongodb://localhost:27017`,
  //cambiar a la linea de abajo para usar docker compose
  //clientUrl: `mongodb://${mongoUsername}:${mongoPassword}@mongo-db:27017`,
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
