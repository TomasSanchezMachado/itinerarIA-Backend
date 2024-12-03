import { Router } from "express";
import { findAll,findOne, remove, sanitizeExternalServiceInput, update,add, findByPlace, addPublicityRequest, acceptPublicityRequest } from "./externalService.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import { patchSchema, postSchema, putSchema } from "../schemas/externalService.js";


export const externalServiceRouter = Router();

externalServiceRouter.get("/", findAll);

externalServiceRouter.get("/:id", findOne);

externalServiceRouter.get("/findByPlace/:id", findByPlace);

externalServiceRouter.post("/", sanitizeExternalServiceInput, validateSchema(postSchema), add);

externalServiceRouter.post("/acceptRequest/:id", acceptPublicityRequest);

externalServiceRouter.put("/:id", sanitizeExternalServiceInput, validateSchema(putSchema), update);

externalServiceRouter.patch("/:id", sanitizeExternalServiceInput, validateSchema(patchSchema), update);

externalServiceRouter.delete("/:id", remove);

