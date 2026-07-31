import type { RequestHandler } from "express";
import { getBranches, getRepositories } from "../services/github.service.js";

export const listRepositories: RequestHandler = async (req, res, next) => {
  try {
    res.json(await getRepositories(req.session.githubAccessToken));
  } catch (error) {
    next(error);
  }
};

export const listBranches: RequestHandler = async (req, res, next) => {
  try {
    res.json(
      await getBranches(
        String(req.params.owner),
        String(req.params.repo),
        req.session.githubAccessToken,
      ),
    );
  } catch (error) {
    next(error);
  }
};
