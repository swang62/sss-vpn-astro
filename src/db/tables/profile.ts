import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

import type { SubscriptionType } from "@/config/types";

import { user } from "./user";

export const profile = t.sqliteTable("profile", {
  createdAt: t
    .integer({ mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  hiddifyId: t
    .text()
    .notNull(),
  purchasedRouter: t
    .integer({ mode: "boolean" })
    .default(false),
  stripeCustomerId: t
    .text()
    .notNull(),
  subscriptionEndAt: t
    .integer({ mode: "timestamp_ms" }),
  subscriptionId: t
    .text(),
  subscriptionItemId: t
    .text(),
  subscriptionStartAt: t
    .integer({ mode: "timestamp_ms" }),
  subscriptionType: t
    .text()
    .notNull()
    .$type<SubscriptionType>()
    .default("none"),
  updatedAt: t
    .integer({ mode: "timestamp_ms" })
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

export type ProfileInsert = Omit<typeof profile.$inferInsert, "userId" >;
