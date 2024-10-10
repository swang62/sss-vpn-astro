import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { createBaseRouter } from "./app";

const route = createBaseRouter()
  .get("/:id", zValidator(
    "param",
    z.object({
      id: z.string().max(50)
    })
  ), async (c) => {
    const { id } = c.req.valid("param");

    return c.json({ id });
  });

export default route;
