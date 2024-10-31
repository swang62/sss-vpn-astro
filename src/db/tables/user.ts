import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

import { account } from "./account";
import { profile } from "./profile";
import { session } from "./session";

export const user = t.sqliteTable("user", {
  banExpires: t
    .integer(),
  banned: t
    .integer({
      mode: "boolean",
    }),
  banReason: t
    .text(),
  createdAt: t
    .integer({ mode: "timestamp" })
    .notNull(),
  email: t
    .text()
    .notNull()
    .unique(),
  emailVerified: t
    .integer({ mode: "boolean" })
    .notNull()
    .default(false),
  id: t
    .text()
    .primaryKey(),
  image: t
    .text(),
  name: t
    .text()
    .notNull(),
  role: t
    .text(),
  updatedAt: t
    .integer({ mode: "timestamp" })
    .notNull(),
});

export const UserRelations = relations(user, ({ many, one }) => ({
  account: one(account),
  profile: one(profile),
  session: many(session),
}));
