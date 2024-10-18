import { Router } from "express";
import { findAll,findOne, remove, sanitizeServicioExternoInput, update,add, findByPlace } from "./servicioExterno.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import { patchSchema, postSchema, putSchema } from "../schemas/servicioExterno.js";


export const servicioExternoRouter = Router();

servicioExternoRouter.get("/", findAll);

servicioExternoRouter.get("/:id", findOne);

servicioExternoRouter.get("/findByPlace/:id", findByPlace);

servicioExternoRouter.post("/", sanitizeServicioExternoInput, validateSchema(postSchema), add);

servicioExternoRouter.put("/:id", sanitizeServicioExternoInput, validateSchema(putSchema), update);

servicioExternoRouter.patch("/:id", sanitizeServicioExternoInput, validateSchema(patchSchema), update);

servicioExternoRouter.delete("/:id", remove);

