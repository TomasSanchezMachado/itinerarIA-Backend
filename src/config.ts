// This file contains the configuration for the application.

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "secret"
export const DB_NAME = (process.env.NODE_ENV === "test") ? "itinerarIA_test" : "itinerarIA";
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 3000;

