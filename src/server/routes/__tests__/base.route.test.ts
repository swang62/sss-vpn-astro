import { testClient } from "hono/testing";

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
});
