import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const session = t.sqliteTable("session", {
  expiresAt: t
    .integer({ mode: "timestamp" })
    .notNull(),
  id: t
    .text()
    .primaryKey(),
  impersonatedBy: t
    .text(),
  ipAddress: t
    .text(),
  userAgent: t
    .text(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const SessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
