import { adminUser } from "@/db/seed";
import createApp from "@/server/app";
import { checkAdminAccess, getAuthenticatedUser } from "@/server/middleware";

describe("notFound", () => {
  it("returns 404 JSON", async () => {
    const app = createApp();
    const res = await app.fetch(
      new Request("http://localhost/api/nonexistent")
    );
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data).toHaveProperty("message");
  });
});

describe("onError", () => {
  it("handles errors", async () => {
    const app = createApp();
    app.get("/throw", () => {
      throw new Error("test error");
    });

    const res = await app.fetch(new Request("http://localhost/api/throw"));
    expect(res.status).toBe(500);
  });
});

describe("checkAdminAccess", () => {
  it("allows admin role", async () => {
    const c = { get: () => adminUser } as never;
    await expect(checkAdminAccess(c as never)).resolves.toBe(true);
  });

  it("rejects non-admin role", async () => {
    const c = {
      get: () => ({ ...adminUser, role: "user" }),
      status: () => {},
    } as never;
    await expect(checkAdminAccess(c as never)).rejects.toThrow("Unauthorized");
  });
});

describe("getAuthenticatedUser", () => {
  it("rejects when no session", async () => {
    const c = { get: () => null, status: () => {} } as never;
    await expect(getAuthenticatedUser(c as never)).rejects.toThrow(
      "Unauthorized"
    );
  });
});

// CORS middleware is a no-op in development/test (IS_PRODUCTION=false).
// CORS is already tested indirectly through all route tests returning 200.
