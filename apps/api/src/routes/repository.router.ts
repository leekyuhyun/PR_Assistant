import { Router } from "express";
import {
  listBranches,
  listRepositories,
} from "../controllers/repository.controller.js";

export const repositoryRouter = Router();
repositoryRouter.get("/", listRepositories);
repositoryRouter.get("/:owner/:repo/branches", listBranches);
