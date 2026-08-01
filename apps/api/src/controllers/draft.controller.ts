import type { RequestHandler } from "express";
import type { GenerateDraftRequest } from "@pullwise/shared";
import { generateDraft } from "../services/gemini.service.js";

export const createDraft: RequestHandler = async (req, res, next) => {
  try {
    const input = req.body as GenerateDraftRequest;
    if (!input.repository || !input.baseBranch || !input.headBranch) {
      return res
        .status(400)
        .json({ message: "저장소와 기준·작업 브랜치를 선택해 주세요." });
    }
    if (input.baseBranch === input.headBranch) {
      return res
        .status(400)
        .json({ message: "서로 다른 브랜치를 선택해 주세요." });
    }
    res.json(await generateDraft(input));
  } catch (error) {
    next(error);
  }
};
