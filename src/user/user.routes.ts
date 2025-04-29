import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeUserInput,
} from "./user.controller.js";
import { validateSchema } from "../shared/middlewares/validateSchema.js";
import { patchSchema, putSchema } from "../schemas/user.js";


export const userRouter = Router();

userRouter.get("/", findAll);

userRouter.get("/:id", findOne);

userRouter.post("/", sanitizeUserInput, add);

userRouter.put("/:id", sanitizeUserInput, validateSchema(putSchema), update);

userRouter.patch("/:id", sanitizeUserInput, validateSchema(patchSchema), update);

userRouter.delete("/:id", remove);