import { testClient } from "hono/testing";

import { parsedApi } from "@/lib/utils";
import createApp from "@/server/app";

import router from "../user.route";

const client = testClient(createApp().route("/", router));

describe("route /api/user", () => {
  it("missing user", async () => {
    const { status } = await parsedApi(
      client.api[":id"].$get({ param: { id: "1000" } }),
    );

    expect(status).toBe(404);
  });

  it("get valid user", async () => {
    const { data, status } = await parsedApi(
      client.api[":id"].$get({ param: { id: "1" } }),
    );

    expect(status).toBe(200);
    expect(data!.user.id).toBe("1");
    expect(data!.user.profile?.role).toBe("admin");
  });
});
