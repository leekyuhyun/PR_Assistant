import session from "express-session";
import { env } from "./env.js";

if (!env.sessionSecret) {
  throw new Error("SESSION_SECRET 환경 변수가 필요합니다.");
}

export const sessionMiddleware = session({
  name: "pullwise.sid",
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    secure: env.nodeEnv === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
