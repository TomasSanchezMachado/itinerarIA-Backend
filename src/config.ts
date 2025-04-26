// export const {
//   PORT = process.env.port || 3000,
//   SALT_ROUNDS = 10,
//   TOKEN_SECRET = process.env.TOKEN_SECRET || "secret",
// } = process.env

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret"
export const DB_NAME = (process.env.NODE_ENV === "test") ? "itinerarIA_test" : "itinerarIA";
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 3000;

