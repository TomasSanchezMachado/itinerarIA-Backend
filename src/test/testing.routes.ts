import { Router } from "express";
import { deleteData } from "./testing.controller.js";

export const testingRouter = Router();
testingRouter.post("/reset", deleteData);
