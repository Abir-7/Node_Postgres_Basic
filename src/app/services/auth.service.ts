import { AuthRepository } from "../repositories/user.repo";
import { AppError } from "../utils/serverTools/AppError";
import getHashedPassword from "../utils/helper/getHashedPassword";

import { Repository } from "../repositories/helper.repo";
import { TUserRole } from "../middleware/auth/auth.interface";
import getOtp from "../utils/helper/getOtp";
import getExpiryTime from "../utils/helper/getExpiryTime";
import { publishJob } from "../lib/rabbitMq/publisher";
import isExpired from "../utils/helper/isExpired";

const registerUser = async (
  userData: { email: string; password: string; role?: TUserRole },
  profileData: {
    full_name: string;
    user_name: string;
    mobile: string;
    address: string;
    gender: "male" | "female" | "other";
    image?: string;
  }
) => {
  const { email, password, role = "user" } = userData;

  // Check if user already exists
  const existing = await AuthRepository.findByEmail(email);
  if (existing && existing.is_verified) {
    throw new Error("User already exists with this email.");
  }

  if (existing && (!existing.is_verified || existing.is_deleted)) {
    AuthRepository.deleteUser(existing.id);
  }

  const password_hash = await getHashedPassword(password);
  const otp = getOtp(4).toString();
  const expire_time = getExpiryTime(10);

  try {
    const { user } = await Repository.transaction(async (trx) => {
      const user = await AuthRepository.createUser(
        { email, password_hash, role, is_verified: false },
        trx
      );

      const profile = await AuthRepository.createProfile(
        { ...profileData, user_id: user.id },
        trx
      );

      const authentication = await AuthRepository.createAuthentication(
        {
          user_id: user.id,
          otp,
          expire_time,
        },
        trx
      );

      await publishJob("emailQueue", {
        to: user.email,
        subject: "Veerification",
        code: otp,
        project_name: "Home Cache",
        expire_time: "24h",
        purpose: "Verify your email",
      });

      // Return the results
      return { user, profile, authentication };
    });

    // Return or use the results outside the transaction
    return { id: user.id, email: user.email };
  } catch (error) {
    // console.error("User registration failed:", error);
    throw error;
  }
};

const verifyUser = async (user_id: string, code: string) => {
  const getAuthenticationData =
    await AuthRepository.getAuthenticationByUserIdAndCode(user_id, code);

  if (!getAuthenticationData) {
    throw new AppError("Code not matched. Try again.", 404);
  }

  if (isExpired(getAuthenticationData.expire_time)) {
    throw new AppError("Time expired. Try resend code.", 400);
  }

  await AuthRepository.updateUser(user_id, { is_verified: true });

  return { message: "User successfully verified." };
};

export const AuthService = {
  registerUser,
  verifyUser,
  // other existing functions...
};
