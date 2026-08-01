import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message:
      error instanceof Error
        ? error.message
        : "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  });
};
