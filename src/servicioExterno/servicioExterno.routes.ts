import { Router } from "express";
import { findAll, remove, sanitizeServicioExternoInput, update } from "./servicioExterno.controller.js";
import { add } from "../lugar/lugar.controller.js";

export const servicioExternoRouter = Router();

servicioExternoRouter.get("/", findAll);

servicioExternoRouter.get("/:id", findAll);

servicioExternoRouter.post("/", sanitizeServicioExternoInput, add);

servicioExternoRouter.put("/:id", sanitizeServicioExternoInput, update);

servicioExternoRouter.patch("/:id", sanitizeServicioExternoInput, update);

servicioExternoRouter.delete("/:id", remove);

