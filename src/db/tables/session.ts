import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const session = sqliteTable("session", {
  createdAt: integer({ mode: "timestamp" }),
  expiresAt: integer({ mode: "timestamp" }),
  id: text().primaryKey(),
  impersonatedBy: text(),
  ipAddress: text(),
  token: text(),
  updatedAt: integer({ mode: "timestamp" }),
  userAgent: text(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const SessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
