import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { sessionMiddleware } from "./config/session.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { authRouter } from "./routes/auth.router.js";
import { draftRouter } from "./routes/draft.router.js";
import { healthRouter } from "./routes/health.router.js";
import { repositoryRouter } from "./routes/repository.router.js";

export const app = express();

app.set("trust proxy", 1);
app.use(cors({ origin: env.appUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(sessionMiddleware);
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/repositories", repositoryRouter);
app.use("/api/drafts", draftRouter);
app.use(errorHandler);
