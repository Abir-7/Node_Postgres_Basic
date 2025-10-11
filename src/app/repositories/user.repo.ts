import { Users } from "./../db/schema/user/user.schema";

import { NodePgQueryResultHKT } from "./../../../node_modules/drizzle-orm/node-postgres/session.d";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";

import { UserProfiles } from "../db/schema/user/user_profiles.schema";
import { UserAuthentications } from "../db/schema/user/user_authentication.schema";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";
import { asc } from "drizzle-orm";
import { DatabaseTransaction } from "./helper.repo";

const createUser = async (
  data: typeof Users.$inferInsert,
  trx?: DatabaseTransaction
) => {
  const [user] = await (trx || db).insert(Users).values(data).returning();
  return user;
};

const findByEmail = async (email: string) => {
  const [user] = await db.select().from(Users).where(eq(Users.email, email));
  return user || null;
};

const findById = async (id: string) => {
  const [user] = await db.select().from(Users).where(eq(Users.id, id));
  return user || null;
};

const getAllUsers = async () => {
  return await db.select().from(Users);
};

const updateUser = async (
  id: string,
  data: Partial<typeof Users.$inferInsert>
) => {
  const [user] = await db
    .update(Users)
    .set(data)
    .where(eq(Users.id, id))
    .returning();
  return user;
};

const deleteUser = async (id: string) => {
  await db.delete(Users).where(eq(Users.id, id));
  return true;
};

//-----------PROFILE

const createProfile = async (
  data: typeof UserProfiles.$inferInsert,
  trx?: DatabaseTransaction
) => {
  const [profile] = await (trx || db)
    .insert(UserProfiles)
    .values(data)
    .returning();
  return profile;
};

//---------Authentication

const createAuthentication = async (
  data: typeof UserAuthentications.$inferInsert,
  trx?: DatabaseTransaction
) => {
  const [auth] = await (trx || db)
    .insert(UserAuthentications)
    .values(data)
    .returning();
  return auth;
};
const getAuthenticationByUserIdAndCode = async (
  user_id: string,
  code: string
) => {
  const auth = await db.query.UserAuthentications.findFirst({
    where: and(
      eq(UserAuthentications.user_id, user_id),
      eq(UserAuthentications.otp, code)
    ),
  });

  return auth || null;
};

export const AuthRepository = {
  createUser,
  findByEmail,
  findById,
  getAllUsers,
  updateUser,
  deleteUser,
  createProfile,
  createAuthentication,
  getAuthenticationByUserIdAndCode,
};
