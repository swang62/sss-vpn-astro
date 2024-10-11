import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";

import { DB_TEST } from "@/lib/constants";

import createApp from "../app";
import router from "../base.route";

const client = testClient(createApp().route("/", router));

describe("route /", () => {
  beforeAll(async () => {
    execSync("pnpm drizzle-kit push");
  });

  afterAll(async () => {
    fs.rmSync(DB_TEST.replace("file:", ""), { force: true });
  });

  it("get /api/status", async () => {
    const response = await client.api.status.$get({ query: { id: "id" } });

    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.query?.id).toBe("id");
      expect(json.production).toBe(false);
    }
  });
});
