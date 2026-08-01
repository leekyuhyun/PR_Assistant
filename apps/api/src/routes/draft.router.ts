import { Router } from "express";
import { createDraft } from "../controllers/draft.controller.js";

export const draftRouter = Router();
draftRouter.post("/", createDraft);
