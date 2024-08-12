import { Router } from "express";
import { login, register } from "../auth/auth.controller.js";
import { sanitizeUsuarioInput } from "../usuario.controller.js";

export const authRouter = Router();

authRouter.post('/login', login);

authRouter.post('/register', sanitizeUsuarioInput, register);
