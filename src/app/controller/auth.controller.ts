import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";
import { AppError } from "../utils/serverTools/AppError";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password, role, profile } = req.body;

  if (!email || !password || !profile || !role) {
    throw new AppError(
      "Email, password, role, and profile data are required",
      400
    );
  }

  const createdUser = await AuthService.registerUser(
    { email, password, role },
    profile
  );

  sendResponse(res, {
    success: true,
    message: "User created successfully",
    status_code: 200,
    data: createdUser,
  });
});

const verifyUser = catchAsync(async (req: Request, res: Response) => {
  const { user_id, code } = req.body;

  const createdUser = await AuthService.verifyUser(user_id, code);

  sendResponse(res, {
    success: true,
    message: "User successfully verified.",
    status_code: 200,
    data: createdUser,
  });
});

export const AuthController = { createUser, verifyUser };
