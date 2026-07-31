import { randomBytes, timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import type { AuthSession } from "@pullwise/shared";
import { env } from "../config/env.js";
import {
  exchangeGitHubCode,
  getGitHubAuthorizationUrl,
  getGitHubUser,
} from "../services/auth.service.js";

const sameState = (actual: string, expected: string) => {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
};

export const startGitHubAuth: RequestHandler = (req, res) => {
  const state = randomBytes(32).toString("hex");
  const url = getGitHubAuthorizationUrl(state);
  if (!url) {
    res.status(503).json({
      message: "GitHub OAuth 환경 변수가 설정되지 않았습니다.",
    });
    return;
  }

  req.session.oauthState = state;
  req.session.save((error) => {
    if (error) {
      res.status(500).json({ message: "로그인 세션을 시작하지 못했습니다." });
      return;
    }
    res.redirect(url);
  });
};

export const handleGitHubCallback: RequestHandler = async (req, res, next) => {
  try {
    const code = String(req.query.code || "");
    const state = String(req.query.state || "");
    const expectedState = req.session.oauthState || "";
    if (!code) {
      res.status(400).json({ message: "OAuth code가 없습니다." });
      return;
    }
    if (!state || !expectedState || !sameState(state, expectedState)) {
      res.status(400).json({ message: "유효하지 않은 OAuth state입니다." });
      return;
    }

    const accessToken = await exchangeGitHubCode(code);
    const user = await getGitHubUser(accessToken);

    req.session.regenerate((regenerateError) => {
      if (regenerateError) {
        next(regenerateError);
        return;
      }
      req.session.githubAccessToken = accessToken;
      req.session.githubUser = user;
      req.session.save((saveError) => {
        if (saveError) {
          next(saveError);
          return;
        }
        res.redirect(env.appUrl);
      });
    });
  } catch (error) {
    next(error);
  }
};

export const getAuthSession: RequestHandler = (req, res) => {
  const response: AuthSession = {
    authenticated: Boolean(
      req.session.githubAccessToken && req.session.githubUser,
    ),
    user: req.session.githubUser || null,
  };
  res.json(response);
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
      return;
    }
    res.clearCookie("pullwise.sid");
    res.status(204).end();
  });
};
