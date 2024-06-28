import { Router } from "express";
import { findAll, findOne, remove, sanitizeServicioExternoInput, update, add } from "./servicioExterno.controller.js";
export const servicioExternoRouter = Router();
servicioExternoRouter.get("/", findAll);
servicioExternoRouter.get("/:id", findOne);
servicioExternoRouter.post("/", sanitizeServicioExternoInput, add);
servicioExternoRouter.put("/:id", sanitizeServicioExternoInput, update);
servicioExternoRouter.patch("/:id", sanitizeServicioExternoInput, update);
servicioExternoRouter.delete("/:id", remove);
//# sourceMappingURL=servicioExterno.routes.js.map