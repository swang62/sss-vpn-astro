import { testClient } from "hono/testing";

import { SITE_ADMIN } from "@/config/constants";
import { TEST_USER } from "@/db/seed";
import { parseApi } from "@/lib/api-clients";
import createApp from "@/server/app";
import { testMiddleware } from "@/server/middleware";

import router from "../user.route";

const clientNoAuth = testClient(createApp().route("/", router));
const client = testClient(createApp().use(testMiddleware).route("/", router));

describe("route /user", () => {
  it("no user found", async () => {
    const { status } = await parseApi(clientNoAuth.api.$get());

    expect(status).toBe(401);
  });

  it("get user", async () => {
    const { data } = await parseApi(client.api.$get());

    expect(data?.user.id).toBe(TEST_USER.id);
    expect(data?.user.email).toBe(SITE_ADMIN);
    expect(data?.session?.userId).toBe(TEST_USER.id);
  });
});
