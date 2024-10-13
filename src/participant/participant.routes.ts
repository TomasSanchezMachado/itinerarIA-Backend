import { Router } from "express";
import {
  sanitizeParticipantInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  addFavorite,
} from "./participant.controller.js";
import { validatePartialParticipant, validateParticipant } from "../schemas/participant.js";

export const participantRouter = Router();

participantRouter.get("/:userId", findAll);

participantRouter.get("/getone/:id", findOne);

participantRouter.post("/", sanitizeParticipantInput, add);

participantRouter.post("/favorite", sanitizeParticipantInput, addFavorite);

participantRouter.put("/:id", sanitizeParticipantInput, update);

participantRouter.patch("/:id", sanitizeParticipantInput, update);

participantRouter.delete("/:id", remove);
