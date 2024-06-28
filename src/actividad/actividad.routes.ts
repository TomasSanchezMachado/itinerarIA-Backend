import { Router } from "express";
import {
  sanitizeActividadInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./actividad.controller.js";

export const actividadRouter = Router();

actividadRouter.get("/", findAll);

actividadRouter.get("/:id", findOne);

actividadRouter.post("/", add);

actividadRouter.put("/:id", update);

actividadRouter.patch("/:id", update);

actividadRouter.delete("/:id", remove);
