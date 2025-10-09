import { Request, Response } from "express";
import { userService } from "../services/user.service";
import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";
import { AppError } from "../utils/serverTools/AppError";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password, role, profile } = req.body;

  if (!email || !password || !profile) {
    throw new AppError("Email, password, and profile data are required", 400);
  }

  const createdUser = await userService.registerUserFull(
    { email, password, role },
    profile
  );

  sendResponse(res, {
    success: true,
    message: "User created successfully",
    status_code: 201,
    data: createdUser,
  });
});

export const userController = { createUser };
