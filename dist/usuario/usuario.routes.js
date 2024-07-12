import { Router } from "express";
import { findAll, findOne, add, update, remove, } from "./usuario.controller.js";
export const usuarioRouter = Router();
usuarioRouter.get("/", findAll);
usuarioRouter.get("/:id", findOne);
usuarioRouter.post("/", add);
usuarioRouter.put("/:id", update);
usuarioRouter.patch("/:id", update);
usuarioRouter.delete("/:id", remove);
//# sourceMappingURL=usuario.routes.js.map