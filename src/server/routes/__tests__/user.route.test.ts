import { testClient } from "hono/testing";

import { adminUser, testUser } from "@/db/seed";
import { parseApi } from "@/lib/api-clients";
import createApp from "@/server/app";

import userRouter from "../user.route";
import { testAdminMiddleware, testUserMiddleware } from "./shared";

const clientNoAuth = testClient(createApp().route("/", userRouter));
const clientAdmin = testClient(createApp().use(testAdminMiddleware).route("/", userRouter));
const clientUser = testClient(createApp().use(testUserMiddleware).route("/", userRouter));

describe("/api/user", () => {
  it("no session data", async () => {
    const { data, statusCode } = await parseApi(
      clientNoAuth.api.$get(),
    );
    expect(statusCode).toBe(401);
    expect(data?.user).toBeFalsy();
  });

  it("get admin user", async () => {
    const { data } = await parseApi(
      clientAdmin.api.$get(),
    );
    expect(data?.user.id).toBe(adminUser.id);
    expect(data?.user.email).toBe(adminUser.email);
    expect(data?.session?.userId).toBe(adminUser.id);
  });
});

describe("/api/user/:id", () => {
  it("query user without auth", async () => {
    const { data, statusCode } = await parseApi(
      clientNoAuth.api[":id"].$get({ param: { id: adminUser.id } }),
    );
    expect(statusCode).toBe(401);
    expect(data?.user).toBeFalsy();
  });

  it("non-admin session, query user", async () => {
    const { data, statusCode } = await parseApi(
      clientUser.api[":id"].$get({ param: { id: adminUser.id } }),
    );
    expect(statusCode).toBe(401);
    expect(data?.user).toBeFalsy();
  });

  it("admin session, query nonexistent user", async () => {
    const { data, statusCode } = await parseApi(
      clientAdmin.api[":id"].$get({ param: { id: "fake_id" } }),
    );
    expect(statusCode).toBe(404);
    expect(data?.user).toBeFalsy();
  });

  it("admin session, query real user", async () => {
    const { data } = await parseApi(
      clientAdmin.api[":id"].$get({ param: { id: testUser.id } }),
    );

    expect(data?.user.id).toBe(testUser.id);
    expect(data?.user.email).toBe(testUser.email);
    expect(data?.user.account?.userId).toBe(testUser.id);
    expect(data?.user.session.length).toBe(0);
  });
});

describe("patch /api/user", () => {
  it("try to update without auth", async () => {
    const { data, statusCode } = await parseApi(
      clientNoAuth.api.$patch({ json: { name: "first_name" } }),
    );
    expect(statusCode).toBe(401);
    expect(data?.user).toBeFalsy();
  });

  it("update long name, validation error", async () => {
    const { data, statusCode } = await parseApi(
      clientAdmin.api.$patch({ json: { name: "namenamenamenamenamename" } }),
    );
    expect(statusCode).toBe(400);
    expect(data?.user).toBeFalsy();
  });

  it("update name successfully", async () => {
    const { data } = await parseApi(
      clientAdmin.api.$patch({ json: { name: "new_name" } }),
    );
    expect(data?.user.name).toBe("new_name");
  });

  it("revert name change", async () => {
    const { data } = await parseApi(
      clientAdmin.api.$patch({ json: { name: adminUser.name } }),
    );
    expect(data?.user.name).toBe(adminUser.name);
  });
});
