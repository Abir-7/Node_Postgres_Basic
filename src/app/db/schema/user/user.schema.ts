import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { user_roles } from "../../../middleware/auth/auth.interface";
import { relations } from "drizzle-orm";
import { UserProfiles } from "./user_profiles.schema";
import { UserAuthentications } from "./user_authentication.schema";

export const userRole = pgEnum("user_role", user_roles);

export const Users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  role: userRole("role").notNull().default("user"),
  password_hash: text("password_hash").notNull(),
  is_verified: boolean("is_verified").notNull().default(false),
  is_blocked: boolean("is_blocked").notNull().default(false),
  is_disabled: boolean("is_disabled").notNull().default(false),
  is_deleted: boolean("is_deleted").notNull().default(false),
  need_to_reset_password: boolean("need_to_reset_password")
    .notNull()
    .default(false),
  ...timestamp,
});

export const UsersRelations = relations(Users, ({ one, many }) => ({
  profile: one(UserProfiles, {
    fields: [Users.id],
    references: [UserProfiles.user_id],
  }),

  authentications: many(UserAuthentications),
}));
