import postmark from "postmark";

import { POSTMARK_TOKEN } from "../config/server";

// Postmark
export const postmarkClient = POSTMARK_TOKEN
  ? new postmark.ServerClient(POSTMARK_TOKEN)
  : null;
