import { Router } from "express";
import {
  sanitizePlaceInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./place.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import { postSchema, putSchema, patchSchema } from "../schemas/place.js";

export const placeRouter = Router();

placeRouter.get("/", findAll);

placeRouter.get("/:id", findOne);

placeRouter.post("/", sanitizePlaceInput, validateSchema(postSchema), add);

placeRouter.put("/:id", sanitizePlaceInput, validateSchema(putSchema), update);

placeRouter.patch(
  "/:id",
  sanitizePlaceInput,
  validateSchema(patchSchema),
  update
);

placeRouter.delete("/:id", remove);
