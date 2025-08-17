import { testClient } from "hono/testing";

import { adminUser, testUser } from "@/db/seed";
import { parseApi } from "@/lib/api-clients";
import createApp from "@/server/app";

import userRouter from "../user.route";
import { testAdminMiddleware, testUserMiddleware } from "./shared";

const apiNoAuth = testClient(createApp().route("/", userRouter)).api;
const apiAdmin = testClient(createApp().use(testAdminMiddleware).route("/", userRouter)).api;
const apiUser = testClient(createApp().use(testUserMiddleware).route("/", userRouter)).api;

describe("/api/user", () => {
  it("no session data", async () => {
    const { data, statusCode } = await parseApi(apiNoAuth.$get());
    expect(statusCode).toBe(401);
    expect(data?.user).toBeFalsy();
  });

  it("get admin user", async () => {
    const { data } = await parseApi(apiAdmin.$get());
    expect(data?.user.id).toBe(adminUser.id);
    expect(data?.user.email).toBe(adminUser.email);
    expect(data?.session?.userId).toBe(adminUser.id);
  });
});

describe("/api/user/:id", () => {
  it("query user without auth", async () => {
    const { data, statusCode } = await parseApi(
      apiNoAuth[":id"].$get({ param: { id: adminUser.id } })
    );
    expect(statusCode).toBe(401);
    expect(data?._user).toBeFalsy();
  });

  it("non-admin session, query user", async () => {
    const { data, statusCode } = await parseApi(
      apiUser[":id"].$get({ param: { id: adminUser.id } })
    );
    expect(statusCode).toBe(401);
    expect(data?._user).toBeFalsy();
  });

  it("admin session, query nonexistent user", async () => {
    const { data, statusCode } = await parseApi(apiAdmin[":id"].$get({ param: { id: "fake_id" } }));
    expect(statusCode).toBe(404);
    expect(data?._user).toBeFalsy();
  });

  it("admin session, query real user", async () => {
    const { data } = await parseApi(apiAdmin[":id"].$get({ param: { id: testUser.id } }));

    expect(data?._user.id).toBe(testUser.id);
    expect(data?._user.email).toBe(testUser.email);
    expect(data?._user.account?.userId).toBe(testUser.id);
    expect(data?._user.session.length).toBe(0);
  });
});

describe("patch /api/user", () => {
  it("try to update without auth", async () => {
    const { data, statusCode } = await parseApi(apiNoAuth.$patch({ json: { name: "first_name" } }));
    expect(statusCode).toBe(401);
    expect(data?.user).toBeFalsy();
  });

  it("update long name, validation error", async () => {
    const { data, statusCode } = await parseApi(
      apiAdmin.$patch({ json: { name: "namenamenamenamenamename" } })
    );
    expect(statusCode).toBe(400);
    expect(data?.user).toBeFalsy();
  });

  it("update name successfully", async () => {
    const { data } = await parseApi(apiAdmin.$patch({ json: { name: "new_name" } }));
    expect(data?.user.name).toBe("new_name");
  });

  it("revert name change", async () => {
    const { data } = await parseApi(apiAdmin.$patch({ json: { name: adminUser.name } }));
    expect(data?.user.name).toBe(adminUser.name);
  });
});
