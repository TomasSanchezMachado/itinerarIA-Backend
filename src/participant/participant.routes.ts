import { Router } from "express";
import {
  sanitizeParticipantInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./participant.controller.js";
import { validatePartialParticipant, validateParticipant } from "../schemas/participant.js";

export const participantRouter = Router();

participantRouter.get("/", findAll);

participantRouter.get("/:id", findOne);

participantRouter.post("/", sanitizeParticipantInput, add);

participantRouter.put("/:id", sanitizeParticipantInput, update);

participantRouter.patch("/:id", sanitizeParticipantInput, update);

participantRouter.delete("/:id", remove);
