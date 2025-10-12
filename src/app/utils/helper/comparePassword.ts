import bcrypt from "bcryptjs";
import { AppError } from "../serverTools/AppError";
import { logger } from "../serverTools/logger";

/**
 * Securely compares a plain password with its hashed version.
 * Throws AppError if they don't match.
 * @param plainPassword - The user's raw password input
 * @param hashedPassword - The hashed password from the database
 * @throws {AppError} Invalid email or password
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<void> => {
  try {
    if (!plainPassword || !hashedPassword) {
      throw new AppError("Password comparison failed: missing input.", 400);
    }

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    if (!isMatch) {
      throw new AppError("Password not matched.", 403);
    }
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unexpected password comparison error.";
    logger?.error?.("Password compare failed:", message);

    throw new AppError("Internal password validation error.", 500);
  }
};
