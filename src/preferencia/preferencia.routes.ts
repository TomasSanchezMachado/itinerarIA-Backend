import { Router } from "express";
import {
  sanitizePreferenciaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./preferencia.controller.js";

export const preferenciaRouter = Router();

preferenciaRouter.get("/", findAll);

preferenciaRouter.get("/:id", findOne);

preferenciaRouter.post("/", sanitizePreferenciaInput, add);

preferenciaRouter.put("/:id", sanitizePreferenciaInput, update);

preferenciaRouter.delete("/:id", remove);