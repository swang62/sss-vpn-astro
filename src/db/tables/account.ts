import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const account = t.sqliteTable("account", {
  accessToken: t.text("accessToken"),
  accountId: t.text("accountId").notNull(),
  expiresAt: t.integer("expiresAt", { mode: "timestamp" }),
  id: t.text("id").primaryKey(),
  idToken: t.text("idToken"),
  password: t.text("password"),
  providerId: t.text("providerId").notNull(),
  refreshToken: t.text("refreshToken"),
  userId: t
    .text("userId")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const AccountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
