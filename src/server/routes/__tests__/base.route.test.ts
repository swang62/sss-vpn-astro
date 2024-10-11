import { testClient } from "hono/testing";

import createApp from "@/server/app";

import router from "../base.route";

const client = testClient(createApp().route("/", router));

describe("route /api/", () => {
  it("get status", async () => {
    const response = await client.api.status.$get({ query: { id: "id" } });

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.query?.id).toBe("id");
      expect(json.production).toBe(false);
    }
  });
});
