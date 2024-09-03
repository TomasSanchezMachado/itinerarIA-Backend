import { Router } from "express";
import { sanitizeItineraryInput, findAll, findOne, add, update, remove, } from "./itinerary.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import { itinerarySchema, patchItinerarySchema } from "../schemas/itinerary.js";
export const itineraryRouter = Router();
itineraryRouter.get("/", findAll);
itineraryRouter.get("/:id", findOne);
itineraryRouter.post("/", sanitizeItineraryInput, validateSchema(itinerarySchema), add);
itineraryRouter.put("/:id", sanitizeItineraryInput, validateSchema(itinerarySchema), update);
itineraryRouter.patch("/:id", sanitizeItineraryInput, validateSchema(patchItinerarySchema), update);
itineraryRouter.delete("/:id", remove);
//# sourceMappingURL=itinerary.routes.js.map