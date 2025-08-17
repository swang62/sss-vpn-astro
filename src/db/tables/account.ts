import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const account = sqliteTable("account", {
  accessToken: text(),
  accessTokenExpiresAt: integer({ mode: "timestamp" }),
  accountId: text().notNull(),
  createdAt: integer({ mode: "timestamp" }),
  id: text().primaryKey(),
  idToken: text(),
  password: text(),
  providerId: text().notNull(),
  refreshToken: text(),
  refreshTokenExpiresAt: integer({ mode: "timestamp" }),
  scope: text(),
  updatedAt: integer({ mode: "timestamp" }),
  userId: text()
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
