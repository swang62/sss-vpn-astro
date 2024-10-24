import { testClient } from "hono/testing";

import { SITE_ADMIN } from "@/config/constants";
import createApp from "@/server/app";

import router from "../base.route";

const client = testClient(createApp().route("/", router));

describe("route /", () => {
  it("get status", async () => {
    const response = await client.api.status.$get();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.production).toBe(false);
  });

  it("get user by email", async () => {
    const response = await client.api["search-email"].$get({
      query: { email: SITE_ADMIN },
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.exists).toBe(true);
  });
});
