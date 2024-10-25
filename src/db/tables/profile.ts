import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

import type { SubscriptionType } from "@/lib/types";

import { user } from "./user";

export const profile = t.sqliteTable("profile", {
  createdAt: t
    .integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  stripeCustomerId: t.text("stripeCustomerId"),
  subscriptionEndAt: t.integer("subscriptionEndAt", { mode: "timestamp_ms" }),
  subscriptionId: t.text("subscriptionId"),
  subscriptionStartAt: t.integer("subscriptionStartAt", {
    mode: "timestamp_ms",
  }),
  subscriptionType: t
    .text("subscriptionType")
    .notNull()
    .$type<SubscriptionType>()
    .default("none"),
  updatedAt: t
    .integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
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
