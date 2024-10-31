import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const account = t.sqliteTable("account", {
  accessToken: t
    .text(),
  accountId: t
    .text()
    .notNull(),
  expiresAt: t
    .integer({ mode: "timestamp" }),
  id: t
    .text()
    .primaryKey(),
  idToken: t
    .text(),
  password: t
    .text(),
  providerId: t
    .text()
    .notNull(),
  refreshToken: t
    .text(),
  userId: t
    .text()
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
