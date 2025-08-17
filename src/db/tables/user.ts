import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { account } from "./account";
import { profile } from "./profile";
import { session } from "./session";
import { verification } from "./verification";

export const user = sqliteTable("user", {
  banExpires: integer({ mode: "timestamp" }),
  banned: integer({ mode: "boolean" }),
  banReason: text(),
  createdAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  email: text().notNull().unique(),
  emailVerified: integer({ mode: "boolean" }).default(false).notNull(),
  id: text().primaryKey(),
  image: text(),
  name: text().notNull(),
  role: text(),
  updatedAt: integer({ mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const UserRelations = relations(user, ({ many, one }) => ({
  account: one(account),
  profile: one(profile),
  session: many(session),
  verification: many(verification),
}));
