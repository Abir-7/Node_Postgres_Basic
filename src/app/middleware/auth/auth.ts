import { Request, Response, NextFunction } from "express";
import { IAuthData, TUserRole } from "./auth.interface";
import { AppError } from "../../utils/serverTools/AppError";

export const auth =
  (allowed_roles?: TUserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token_with_bearer = req.headers.authorization as string;
    if (!token_with_bearer || !token_with_bearer.startsWith("Bearer")) {
      return next(new AppError("You are not authorized", 401));
    }
    const token = token_with_bearer.split(" ")[1];

    if (token === "null") {
      return next(new AppError("You are not authorized", 401));
    }

    try {
      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid Basic token format" });
    }
  };
