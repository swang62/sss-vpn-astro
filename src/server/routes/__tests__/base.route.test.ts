import { testClient } from "hono/testing";

import { adminUser, testUser } from "@/db/seed";
import { parseApi } from "@/lib/api-clients";
import createApp from "@/server/app";

import baseRouter from "../base.route";
import { testAdminMiddleware, testUserMiddleware } from "./shared";

const clientNoAuth = testClient(createApp().route("/", baseRouter));
const clientAdmin = testClient(createApp().use(testAdminMiddleware).route("/", baseRouter));
const clientUser = testClient(createApp().use(testUserMiddleware).route("/", baseRouter));

describe("/api/status", () => {
  it("get API status", async () => {
    const { data, statusCode } = await parseApi(
      clientNoAuth.api.status.$get(),
    );
    expect(statusCode).toBe(200);
    expect(data?.production).toBe(false);
  });
});

describe("/api/search-email", () => {
  it("get an existing user by email", async () => {
    const { data } = await parseApi(
      clientNoAuth.api["search-email"].$get({
        query: { email: adminUser.email },
      }),
    );
    expect(data?.exists).toBe(true);
  });

  it("get an nonexistent user by email", async () => {
    const { data } = await parseApi(
      clientNoAuth.api["search-email"].$get({
        query: { email: "fake@email.com" },
      }),
    );
    expect(data?.exists).toBe(false);
  });
});

describe("/api/session", () => {
  it("no session data", async () => {
    const { data } = await parseApi(
      clientNoAuth.api.session.$get(),
    );
    expect(data?.session).toBeFalsy();
  });

  it("admin session", async () => {
    const { data } = await parseApi(
      clientAdmin.api.session.$get(),
    );
    expect(data?.session?.userId).toBe(adminUser.id);
  });

  it("user session", async () => {
    const { data } = await parseApi(
      clientUser.api.session.$get(),
    );
    expect(data?.session?.userId).toBe(testUser.id);
  });
});
