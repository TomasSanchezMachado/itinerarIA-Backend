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
import { authenticateJWT } from "../shared/middlewares/jwtMiddleware.js";

export const preferenceRouter = Router();

preferenceRouter.get("/",authenticateJWT,findAll);

preferenceRouter.get("/:id",authenticateJWT,findOne);

preferenceRouter.post("/", sanitizePreferenceInput,validateSchema(preferenceSchema), authenticateJWT, add);

preferenceRouter.put("/:id", sanitizePreferenceInput, authenticateJWT, update);

preferenceRouter.patch("/:id", sanitizePreferenceInput, authenticateJWT, update);

preferenceRouter.delete("/:id",authenticateJWT, remove);