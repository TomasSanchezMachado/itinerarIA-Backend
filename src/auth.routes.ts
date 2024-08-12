import { Router } from "express";
import { login, register } from "./auth.controller";
import { sanitizeUsuarioInput } from "./usuario/usuario.controller";

const authRouter = Router();

authRouter.post('/login', login);

authRouter.post('/register', sanitizeUsuarioInput, register);
