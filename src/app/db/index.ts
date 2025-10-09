// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { appConfig } from "../config/appConfig";
import {
  UserAuthentications,
  UserAuthenticationsRelations,
} from "./schema/user/user_authentication.schema";
import {
  UserProfiles,
  UserProfilesRelations,
} from "./schema/user/user_profiles.schema";
import { Users, UsersRelations } from "./schema/user/user.schema";

const pool = new Pool({
  connectionString: appConfig.database.dataBase_uri,
});
export const db = drizzle(pool, {
  schema: {
    UserAuthentications,
    UserProfilesRelations,
    Users,
    UserProfiles,
    UsersRelations,
    UserAuthenticationsRelations,
  },
});
