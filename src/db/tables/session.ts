import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const session = sqliteTable("session", {
  createdAt: integer({ mode: "timestamp" }).notNull(),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  id: text().primaryKey(),
  impersonatedBy: text(),
  ipAddress: text(),
  token: text().notNull().unique(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),
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
