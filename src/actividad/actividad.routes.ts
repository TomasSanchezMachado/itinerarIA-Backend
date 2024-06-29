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

actividadRouter.post("/",sanitizeActividadInput, add);

actividadRouter.put("/:id", sanitizeActividadInput,update);

actividadRouter.patch("/:id", update);

actividadRouter.delete("/:id", remove);
