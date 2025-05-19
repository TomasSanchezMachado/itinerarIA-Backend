import { Router } from "express";
import { findAll,findOne, findByPlace } from "./externalService.controller.js";

export const externalServiceProtectedRouter = Router();

externalServiceProtectedRouter.get("/", findAll);

externalServiceProtectedRouter.get("/:id", findOne);

externalServiceProtectedRouter.get("/findByPlace/:id", findByPlace);