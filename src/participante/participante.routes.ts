import { Router } from "express";
import {
  sanitizeParticipanteInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./participante.controller.js";

export const participanteRouter = Router();

participanteRouter.get("/", findAll);

participanteRouter.get("/:id", findOne);

participanteRouter.post("/", sanitizeParticipanteInput, add);

participanteRouter.put("/:id", sanitizeParticipanteInput, update);

participanteRouter.delete("/:id", remove);
