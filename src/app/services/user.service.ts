import { UserRepository } from "../repositories/user.repo";
import { AppError } from "../utils/serverTools/AppError";
import getHashedPassword from "../utils/helper/getHashedPassword";

import { Repository } from "../repositories/helper.repo";
import { TUserRole } from "../middleware/auth/auth.interface";
import getOtp from "../utils/helper/getOtp";
import getExpiryTime from "../utils/helper/getExpiryTime";

const registerUserFull = async (
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
  const existing = await UserRepository.findByEmail(email);
  if (existing) {
    throw new Error("User already exists with this email.");
  }

  const password_hash = await getHashedPassword(password);
  const otp = getOtp(4).toString();
  const expire_time = getExpiryTime(10);

  try {
    const { user, profile, authentication } = await Repository.transaction(
      async (trx) => {
        const user = await UserRepository.createUser(
          { email, password_hash, role, is_verified: false },
          trx
        );

        const profile = await UserRepository.createProfile(
          { ...profileData, user_id: user.id },
          trx
        );

        const authentication = await UserRepository.createAuthentication(
          {
            user_id: user.id,
            otp,
            expire_time,
          },
          trx
        );

        // Return the results
        return { user, profile, authentication };
      }
    );

    // Return or use the results outside the transaction
    return { user, profile, authentication };
  } catch (error) {
    console.error("User registration failed:", error);
    throw new Error("Failed to create user.");
  }
};

export const userService = {
  registerUserFull,
  // other existing functions...
};
