import { testClient } from "hono/testing";

import { SITE_ADMIN } from "@/config/constants";
import createApp from "@/server/app";
import { testMiddleware } from "@/server/middleware";

import router from "../user.route";

const clientNoAuth = testClient(createApp().route("/", router));
const client = testClient(createApp().use(testMiddleware).route("/", router));

describe("route /user", () => {
  it("no user found", async () => {
    const response = await clientNoAuth.api.$get();

    expect(response.status).toBe(401);
  });

  it("get user", async () => {
    const response = await client.api.$get();
    const data = await response.json();

    expect(data.user.id).toBe("1");
    expect(data.user.email).toBe(SITE_ADMIN);
    expect(data.user.profile?.subscription).toBe("premium");
  });

  it("get session", async () => {
    const response = await client.api.session.$get();
    const data = await response.json();

    expect(data.session?.userId).toBe("1");
    expect(new Date(data.user.createdAt)).toBeTruthy();
  });
});
