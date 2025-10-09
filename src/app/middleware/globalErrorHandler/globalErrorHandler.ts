import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/serverTools/AppError";
import { logger } from "../../utils/serverTools/logger";
import { ZodError } from "zod";

export const globalErrorHandler = (
  err: unknown, // accept anything thrown
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let status_code = 500;
  let message = "Internal Server Error";
  let errors: { path: string; message: string }[] = [];

  // Handle AppError
  if (err instanceof AppError) {
    status_code = err.status_code;
    message = err.message;
    errors.push({ path: "", message: err.message });
  }

  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    status_code = 400;
    message = "Validation Error";
    errors = err.issues.map((issue) => ({
      path: issue.path.join(".") || "",
      message: issue.message,
    }));
  }

  // Handle any other Error instance
  else if (err instanceof Error) {
    message = err.message || message;
    errors.push({ path: "", message: err.message || message });
  }

  // Handle unknown non-Error throwables
  else {
    message = "Something went wrong. Try again.";
    errors.push({ path: "", message: String(err) || message });
  }

  // Log full details
  logger.error(
    `[${req.method}] ${req.originalUrl} → ${message} | ${
      err instanceof Error ? err.stack || "no stack" : String(err)
    }`
  );

  // Send structured response
  res.status(status_code).json({
    success: false,
    status_code: status_code,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" &&
      err instanceof Error && { stack: err.stack }),
  });
};
