import { Router } from "express";
import {
  sanitizeItinerarioInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./itinerario.controller.js";

export const itinerarioRouter = Router();

itinerarioRouter.get("/", findAll);

itinerarioRouter.get("/:id", findOne);

itinerarioRouter.post("/", sanitizeItinerarioInput, add);

itinerarioRouter.put("/:id", sanitizeItinerarioInput, update);

itinerarioRouter.patch("/:id", sanitizeItinerarioInput, update);

itinerarioRouter.delete("/:id", remove);
