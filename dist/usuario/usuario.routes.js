import { Router } from "express";
import { findAll, findOne, add, update, remove, sanitizeUsuarioInput, } from "../usuario/usuario.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import { patchSchema, putSchema } from "../schemas/usuario.js";
export const usuarioRouter = Router();
usuarioRouter.get("/", findAll);
usuarioRouter.get("/:id", findOne);
usuarioRouter.post("/", sanitizeUsuarioInput, add);
usuarioRouter.put("/:id", sanitizeUsuarioInput, validateSchema(putSchema), update);
usuarioRouter.patch("/:id", sanitizeUsuarioInput, validateSchema(patchSchema), update);
usuarioRouter.delete("/:id", remove);
//# sourceMappingURL=usuario.routes.js.map