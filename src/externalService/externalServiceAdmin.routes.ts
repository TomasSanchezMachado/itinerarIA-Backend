import { Router } from "express";
import { remove, sanitizeExternalServiceInput, update,add, acceptPublicityRequest } from "./externalService.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import { patchSchema, postSchema, putSchema } from "../schemas/externalService.js";


export const externalServiceAdminRouter = Router();

externalServiceAdminRouter.post("/", sanitizeExternalServiceInput, validateSchema(postSchema), add);

externalServiceAdminRouter.post("/acceptRequest/:id", acceptPublicityRequest);

externalServiceAdminRouter.put("/:id", sanitizeExternalServiceInput, validateSchema(putSchema), update);

externalServiceAdminRouter.patch("/:id", sanitizeExternalServiceInput, validateSchema(patchSchema), update);

externalServiceAdminRouter.delete("/:id", remove);

