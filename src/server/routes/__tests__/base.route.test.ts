import { testClient } from "hono/testing";

import { TEST_EMAIL } from "@/config/constants";
import { parseApi } from "@/lib/api-clients";
import createApp from "@/server/app";

import router from "../base.route";

const client = testClient(createApp().route("/", router));

describe("route /", () => {
  it("get status", async () => {
    const { data, status } = await parseApi(client.api.status.$get());

    expect(status).toBe(200);
    expect(data?.production).toBe(false);
  });

  it("get user by email", async () => {
    const { data, status } = await parseApi(
      client.api["search-email"].$get({
        query: { email: TEST_EMAIL },
      }),
    );

    expect(status).toBe(200);
    expect(data?.exists).toBe(true);
  });
});
