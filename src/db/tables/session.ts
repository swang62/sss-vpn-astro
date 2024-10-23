import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

import { user } from "./user";

export const session = t.sqliteTable("session", {
  expiresAt: t.integer("expiresAt", { mode: "timestamp" }).notNull(),
  id: t.text("id").primaryKey(),
  impersonatedBy: t.text("impersonatedBy"),
  ipAddress: t.text("ipAddress"),
  userAgent: t.text("userAgent"),
  userId: t
    .text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const SessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));
