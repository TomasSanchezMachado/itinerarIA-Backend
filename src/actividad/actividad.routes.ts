import { Router } from "express";
import {
  sanitizeActividadInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./actividad.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import { activitySchema, patchActivitySchema } from "../schemas/activity.js";

export const actividadRouter = Router();

actividadRouter.get("/", findAll);

actividadRouter.get("/:id", findOne);

actividadRouter.post("/",sanitizeActividadInput,validateSchema(activitySchema),add);

actividadRouter.put("/:id", sanitizeActividadInput,validateSchema(activitySchema),update);

actividadRouter.patch("/:id",validateSchema(patchActivitySchema) ,update);

actividadRouter.delete("/:id", remove);
