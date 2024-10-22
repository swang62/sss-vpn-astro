import { testClient } from "hono/testing";

import createApp from "@/server/app";

import router from "../user.route";

const client = testClient(createApp().route("/", router));

describe("route /api/user", () => {
  it("missing user", async () => {
    const response = await client.api[":id"].$get({ param: { id: "1000" } });

    expect(response.status).toBe(404);
  });

  // it("get valid user", async () => {
  //   const response = await client.api[":id"].$get({ param: { id: "1" } });

  //   expect(response.status).toBe(200);
  // });
});
