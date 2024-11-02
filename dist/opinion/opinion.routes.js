import { Router } from "express";
import { sanitizeOpinionInput, findAll, findAllByActivity, findOne, add, update, remove } from "./opinion.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import { opinionSchema, patchOpinionSchema } from "../schemas/opinion.js";
export const opinionRouter = Router();
opinionRouter.get("/", findAll);
opinionRouter.get("/:id", findOne);
opinionRouter.get("/activity/:id", findAllByActivity);
opinionRouter.post("/", sanitizeOpinionInput, validateSchema(opinionSchema), add);
opinionRouter.put("/:id", sanitizeOpinionInput, validateSchema(opinionSchema), update);
opinionRouter.patch("/:id", validateSchema(patchOpinionSchema), update);
opinionRouter.delete("/:id", remove);
//# sourceMappingURL=opinion.routes.js.map