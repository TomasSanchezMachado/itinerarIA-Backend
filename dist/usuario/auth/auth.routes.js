import { Router } from "express";
import { login, logout, profile, register, validateToken } from "../auth/auth.controller.js";
import { sanitizeUsuarioInput } from "../usuario.controller.js";
export const authRouter = Router();
authRouter.post('/login', login);
authRouter.post('/register', sanitizeUsuarioInput, register);
authRouter.post('/logout', logout);
authRouter.post('/profile', validateToken, profile);
//# sourceMappingURL=auth.routes.js.map