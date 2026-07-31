import { Router } from "express";
import {
  getAuthSession,
  handleGitHubCallback,
  logout,
  startGitHubAuth,
} from "../controllers/auth.controller.js";

export const authRouter = Router();
authRouter.get("/github", startGitHubAuth);
authRouter.get("/github/callback", handleGitHubCallback);
authRouter.get("/session", getAuthSession);
authRouter.post("/logout", logout);
