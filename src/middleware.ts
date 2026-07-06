import type { MiddlewareHandler } from "astro";

import { getUserById } from "@/db/queries";
import { auth } from "@/lib/auth";
import { setHeaders } from "@/lib/headers";

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const { pathname } = ctx.url;

  const requireAuth = pathname.startsWith("/dashboard");
  const requireAuthAdmin = pathname.includes("debug");

  // Bypass unauthenticated routes
  if (!requireAuth) {
    const response = await next();
    setHeaders(response.headers);
    return response;
  }

  // Store session
  const session = await auth.api.getSession({
    headers: ctx.request.headers,
  });

  if (!session) {
    const response = ctx.redirect("/login");
    setHeaders(response.headers);
    return response;
  }

  if (requireAuthAdmin && session.user.role !== "admin") {
    const response = ctx.redirect("/dashboard");
    setHeaders(response.headers);
    return response;
  }

  // Store in Astro.locals
  const user = await getUserById(session.user.id);
  if (!user) {
    const response = ctx.redirect("/login");
    setHeaders(response.headers);
    return response;
  }

  ctx.locals.session = session.session;
  ctx.locals.userSession = session.user;
  ctx.locals.user = user;

  const response = await next();
  setHeaders(response.headers);
  return response;
};

// type ValidContext = When.DevServer | When.Server;

// const middlewares: Record<ValidContext, MiddlewareHandler> = {
//   [When.DevServer]: (ctx, next) => authenticate(ctx, next),
//   [When.Server]: (ctx, next) => authenticate(ctx, next),
// };

// export const onRequest = middlewares[whenAmI as ValidContext];

// export const onRequest: MiddlewareHandler = (ctx, next) =>
//   authenticate(ctx, next);
