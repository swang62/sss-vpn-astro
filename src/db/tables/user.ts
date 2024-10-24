import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

import { account } from "./account";
import { profile } from "./profile";
import { session } from "./session";

export const user = t.sqliteTable("user", {
  banExpires: t.integer("banExpires"),
  banned: t.integer("banned", {
    mode: "boolean",
  }),
  banReason: t.text("banReason"),
  createdAt: t.integer("createdAt", { mode: "timestamp" }).notNull(),
  email: t.text("email").notNull().unique(),
  emailVerified: t
    .integer("emailVerified", { mode: "boolean" })
    .notNull()
    .default(false),
  id: t.text("id").primaryKey(),
  image: t.text("image"),
  name: t.text("name").notNull(),
  role: t.text("role"),
  updatedAt: t.integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const UserRelations = relations(user, ({ many, one }) => ({
  account: one(account),
  profile: one(profile),
  session: many(session),
}));

export type User = typeof user.$inferSelect & {
  profile: typeof profile.$inferSelect | null;
};
