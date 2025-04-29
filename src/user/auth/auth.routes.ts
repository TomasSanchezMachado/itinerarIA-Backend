import { Router } from "express";
import { login, logout, profile, register, validateToken,verify } from "./auth.controller.js";
import { sanitizeUserInput } from "../user.controller.js";
import { validateSchema } from "../../shared/middlewares/validateSchema.js";
import { registerSchema, loginSchema } from "../../schemas/auth.js";

export const authRouter = Router();

authRouter.post('/login', sanitizeUserInput, validateSchema(loginSchema), login);
authRouter.post('/register', sanitizeUserInput, validateSchema(registerSchema), register);
authRouter.post('/logout', logout);
authRouter.post('/profile', validateToken, profile);
authRouter.get('/verify', verify);
