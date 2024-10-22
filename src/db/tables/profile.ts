import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

import type { Subscription } from "@/types";

import { user } from "./user";

export const profile = t.sqliteTable("profile", {
  createdAt: t
    .integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  subscription: t.text("subscription").$type<Subscription>().default("none"),
  updatedAt: t
    .integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
  userId: t
    .text("userId")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
});

export const ProfileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
}));
