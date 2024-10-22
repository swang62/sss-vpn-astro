import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  createdAt: integer("createdAt", {
    mode: "timestamp",
  }).notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", {
    mode: "boolean",
  }).notNull(),
  id: text("id").primaryKey(),
  image: text("image"),
  name: text("name").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }).notNull(),
  id: text("id").primaryKey(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable("account", {
  accessToken: text("accessToken"),
  accountId: text("accountId").notNull(),
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }),
  id: text("id").primaryKey(),
  idToken: text("idToken"),
  password: text("password"),
  providerId: text("providerId").notNull(),
  refreshToken: text("refreshToken"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const verification = sqliteTable("verification", {
  expiresAt: integer("expiresAt", {
    mode: "timestamp",
  }).notNull(),
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
});
