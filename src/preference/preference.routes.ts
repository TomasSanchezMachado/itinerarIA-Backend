import { Router } from "express";
import {
  sanitizePreferenceInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./preference.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import {preferenceSchema} from "../schemas/preference.js";

export const preferenceRouter = Router();

preferenceRouter.get("/", findAll);

preferenceRouter.get("/:id", findOne);

preferenceRouter.post("/", sanitizePreferenceInput,validateSchema(preferenceSchema),add);

preferenceRouter.put("/:id", sanitizePreferenceInput,update);

preferenceRouter.patch("/:id", sanitizePreferenceInput, update);

preferenceRouter.delete("/:id", remove);