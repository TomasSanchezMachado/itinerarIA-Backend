import { Router } from "express";
import { sanitizeExternalServiceInput, addPublicityRequest } from "./externalService.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import { postSchema as externalServiceSchema } from "../schemas/externalService.js";

export const publicExternalServiceRouter = Router();

publicExternalServiceRouter.post("/", sanitizeExternalServiceInput, validateSchema(externalServiceSchema), addPublicityRequest);




