import { Router } from "express";
import { sanitizeOpinionInput, findAll, findOne, add, update, remove } from "./opinion.controller.js";
export const opinionRouter = Router();
opinionRouter.get("/", findAll);
opinionRouter.get("/:id", findOne);
opinionRouter.post("/", sanitizeOpinionInput, add);
opinionRouter.put("/:id", sanitizeOpinionInput, update);
opinionRouter.patch("/:id", update);
opinionRouter.delete("/:id", remove);
//# sourceMappingURL=opinion.routes.js.map