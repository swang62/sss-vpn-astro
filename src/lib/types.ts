import type { PinoLogger } from "hono-pino";

export interface Bindings {
  Variables: {
    logger: PinoLogger;
  };
}
