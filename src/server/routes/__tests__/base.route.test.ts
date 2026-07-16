import { testClient } from "hono/testing";

import { adminUser, testUser } from "@/db/seed";
import { parseApi } from "@/lib/api-clients";
import createApp from "@/server/app";

import baseRouter from "../base.route";
import { testAdminMiddleware, testUserMiddleware } from "./shared";

const apiNoAuth = testClient(createApp().route("/", baseRouter)).api;
const apiAdmin = testClient(
  createApp().use(testAdminMiddleware).route("/", baseRouter)
).api;
const apiUser = testClient(
  createApp().use(testUserMiddleware).route("/", baseRouter)
).api;

describe("/api/status", () => {
  it("get API status", async () => {
    const result = await parseApi(apiNoAuth.status.$get);
    expect(result.statusCode).toBe(200);
    expect(result.ok).toBe(true);
    expect(result.data?.production).toBe(false);
  });
});

describe("/api/search-email", () => {
  it("get an existing user by email", async () => {
    const result = await parseApi(apiNoAuth["search-email"].$get, {
      query: { email: adminUser.email },
    });
    expect(result.ok).toBe(true);
    expect(result.data?.exists).toBe(true);
  });

  it("get an nonexistent user by email", async () => {
    const result = await parseApi(apiNoAuth["search-email"].$get, {
      query: { email: "fake@email.com" },
    });
    expect(result.ok).toBe(true);
    expect(result.data?.exists).toBe(false);
  });
});

describe("/api/session", () => {
  it("no session data", async () => {
    const result = await parseApi(apiNoAuth.session.$get);
    expect(result.data?.session).toBeFalsy();
  });

  it("admin session", async () => {
    const result = await parseApi(apiAdmin.session.$get);
    expect(result.ok).toBe(true);
    expect(result.data?.session?.userId).toBe(adminUser.id);
  });

  it("user session", async () => {
    const result = await parseApi(apiUser.session.$get);
    expect(result.ok).toBe(true);
    expect(result.data?.session?.userId).toBe(testUser.id);
  });
});

describe("/api/location", () => {
  it("returns IP address", async () => {
    const result = await parseApi(apiNoAuth.location.$get);
    expect(result.ok).toBe(true);
    expect(result.data?.ip).toBeTruthy();
  });
});

describe("/api/error", () => {
  it("returns 500 with message", async () => {
    const result = await parseApi(apiNoAuth.error.$put);
    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(500);
  });
});
