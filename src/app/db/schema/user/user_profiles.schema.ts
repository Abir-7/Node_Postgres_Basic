import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

import { timestamps } from "../../helper/columns.helpers";
import { Users } from "./user.schema";
import { relations } from "drizzle-orm";

// Optional: Gender enum
export const genders = ["male", "female", "other"] as const;
export type TGender = (typeof genders)[number];
export const genderEnum = pgEnum("gender_enum", genders);

// UserProfiles table
export const UserProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }), // FK to users table
  full_name: varchar("full_name", { length: 100 }).notNull(),
  user_name: varchar("user_name", { length: 50 }).notNull().unique(),
  mobile: varchar("mobile", { length: 20 }).notNull().unique(),
  address: text("address").notNull(),
  gender: genderEnum("gender").notNull(),
  image: text("image"), // URL or base64
  ...timestamps,
});

export const UserProfilesRelations = relations(UserProfiles, ({ one }) => ({
  user: one(Users, {
    fields: [UserProfiles.user_id],
    references: [Users.id],
  }),
}));
