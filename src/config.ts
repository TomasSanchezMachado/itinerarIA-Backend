export const { 
  PORT = process.env.port || 3000,
  SALT_ROUNDS = 10,
  TOKEN_SECRET = process.env.TOKEN_SECRET || "secret",
 } = process.env

