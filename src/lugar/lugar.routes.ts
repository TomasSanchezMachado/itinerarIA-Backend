import { Router } from "express";
import {
  sanitizeLugarInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./lugar.controller.js";

export const lugarRouter = Router();

lugarRouter.get("/", findAll);

lugarRouter.get("/:id", findOne);

lugarRouter.post("/", sanitizeLugarInput, add);

lugarRouter.put("/:id", sanitizeLugarInput, update);

lugarRouter.patch("/:id", sanitizeLugarInput, update);

lugarRouter.delete("/:id", remove);
