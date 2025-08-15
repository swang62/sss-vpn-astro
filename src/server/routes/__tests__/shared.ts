import { createMiddleware } from "hono/factory";

import type { Bindings } from "@/server/app";

import { adminUser, testUser } from "@/db/seed";

// Seeds in the admin user session for testing purposes only
export const testAdminMiddleware = createMiddleware<Bindings>(async (c, next) => {
  const now = new Date();
  c.set("userSession", adminUser);
  c.set("session", {
    createdAt: now,
    expiresAt: now,
    id: adminUser.id,
    token: "123",
    updatedAt: now,
    userId: adminUser.id,
  });
  return next();
});

export const testUserMiddleware = createMiddleware<Bindings>(async (c, next) => {
  const now = new Date();
  c.set("userSession", testUser);
  c.set("session", {
    createdAt: now,
    expiresAt: now,
    id: testUser.id,
    token: "123",
    updatedAt: now,
    userId: testUser.id,
  });
  return next();
});
