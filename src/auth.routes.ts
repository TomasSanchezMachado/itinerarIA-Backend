import { Router } from "express";
import { login, register } from "./auth.controller.ts";

const authRouter = Router();

authRouter.post('/login', login);

authRouter.post('/register', register);
