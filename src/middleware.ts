import type { MiddlewareHandler } from "astro";

import { When, whenAmI } from "@it-astro:when";

import { auth } from "@/lib/auth";

import { getUserById } from "./db/queries";

export const authenticate: MiddlewareHandler = async (ctx, next) => {
  const { pathname } = ctx.url;

  const needsAuth = pathname.startsWith("/dashboard");
  if (!needsAuth) return next();

  // Store session
  const session = await auth.api.getSession({
    headers: ctx.request.headers,
  });

  // Redirect for invalid sessions
  if (needsAuth) {
    if (!session) {
      return ctx.redirect("/login");
    } else {
      const user = await getUserById(session.user.id);
      if (user) {
        ctx.locals.session = session.session;
        ctx.locals.userSession = session.user;
        ctx.locals.user = user;
      } else {
        return ctx.redirect("/login");
      }
    }
  }

  return next();
};

type ValidContext = When.DevServer | When.Server;
const middlewares: Record<ValidContext, MiddlewareHandler> = {
  [When.DevServer]: (ctx, next) => {
    return authenticate(ctx, next);
  },
  [When.Server]: (ctx, next) => {
    return authenticate(ctx, next);
  },
};

export const onRequest = middlewares[whenAmI as ValidContext];
