import { testClient } from "hono/testing";

import { adminUser, testUser } from "@/db/seed";
import { parseApi } from "@/lib/api-clients";
import createApp from "@/server/app";

import userRouter from "../user.route";
import { testAdminMiddleware, testUserMiddleware } from "./shared";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: {
      retrieve: vi.fn(() => Promise.resolve({ deleted: false })),
      update: vi.fn(),
      del: vi.fn(),
    },
  },
}));

vi.mock("@/lib/axios", () => ({
  axiosHiddify: {
    get: vi.fn(() => Promise.resolve({ data: { uuid: null } })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

const apiNoAuth = testClient(createApp().route("/", userRouter)).api;
const apiAdmin = testClient(
  createApp().use(testAdminMiddleware).route("/", userRouter)
).api;
const apiUser = testClient(
  createApp().use(testUserMiddleware).route("/", userRouter)
).api;

describe("/api/user", () => {
  it("no session data", async () => {
    const result = await parseApi(apiNoAuth.$get);
    expect(result.ok).toBe(false);
  });

  it("get admin user", async () => {
    const result = await parseApi(apiAdmin.$get);
    expect(result.ok).toBe(true);
    expect(result.data?.user.id).toBe(adminUser.id);
    expect(result.data?.user.email).toBe(adminUser.email);
    expect(result.data?.session?.userId).toBe(adminUser.id);
  });

  it("get regular user returns own data", async () => {
    const result = await parseApi(apiUser.$get);
    expect(result.ok).toBe(true);
    expect(result.data?.user.id).toBe(testUser.id);
    expect(result.data?.user.email).toBe(testUser.email);
    expect(result.data?.user.role).toBe("user");
  });
});

describe("/api/user/:id", () => {
  it("query user without auth", async () => {
    const result = await parseApi(apiNoAuth[":id"].$get, {
      param: { id: adminUser.id },
    });
    expect(result.ok).toBe(false);
  });

  it("non-admin, query user", async () => {
    const result = await parseApi(apiUser[":id"].$get, {
      param: { id: adminUser.id },
    });
    expect(result.ok).toBe(false);
  });

  it("admin, query nonexistent user", async () => {
    const result = await parseApi(apiAdmin[":id"].$get, {
      param: { id: "fake_id" },
    });
    expect(result.ok).toBe(false);
  });

  it("admin, query real user", async () => {
    const result = await parseApi(apiAdmin[":id"].$get, {
      param: { id: testUser.id },
    });
    expect(result.ok).toBe(true);
    expect(result.data?._user.id).toBe(testUser.id);
    expect(result.data?._user.email).toBe(testUser.email);
    expect(result.data?._user.account?.userId).toBe(testUser.id);
    expect(result.data?._user.session.length).toBe(0);
  });
});

describe("patch /api/user", () => {
  it("try to update without auth", async () => {
    const result = await parseApi(apiNoAuth.$patch, {
      json: { name: "first_name" },
    });
    expect(result.ok).toBe(false);
  });

  it("update long name, validation error", async () => {
    const result = await parseApi(apiAdmin.$patch, {
      json: { name: "namenamenamenamenamename" },
    });
    expect(result.ok).toBe(false);
  });

  it("update name successfully", async () => {
    const result = await parseApi(apiAdmin.$patch, {
      json: { name: "new_name" },
    });
    expect(result.ok).toBe(true);
    expect(result.data?.user.name).toBe("new_name");
  });

  it("revert name change", async () => {
    const result = await parseApi(apiAdmin.$patch, {
      json: { name: adminUser.name },
    });
    expect(result.ok).toBe(true);
    expect(result.data?.user.name).toBe(adminUser.name);
  });
});
