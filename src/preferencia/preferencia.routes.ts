import { Router } from "express";
import {
  sanitizeParticipanteInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./preferencia.controller.s";

export const preferenciaRouter = Router();

preferenciaRouter.get("/", findAll);

preferenciaRouter.get("/:id", findOne);

preferenciaRouter.post("/", sanitizeParticipanteInput, add);

preferenciaRouter.put("/:id", sanitizeParticipanteInput, update);

preferenciaRouter.delete("/:id", remove);