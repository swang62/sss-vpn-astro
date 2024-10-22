import { defineMiddleware } from "astro:middleware";

import { auth } from "@/lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Ignore middleware on static routes
  if (["/", "/debug"].includes(pathname)) {
    return next();
  }

  // Store session
  const session = await auth.api.getSession({
    headers: context.request.headers,
  });
  context.locals.session = session;
  console.debug("session:", JSON.stringify(session));

  switch (pathname) {
    case "/dashboard":
      if (!session) {
        console.error(pathname, "Unauthenticated");
        return context.redirect("/login");
      }
      break;

    case "/login":
    case "/signup":
    case "/forgot":
      if (session) {
        console.info(pathname, "Already logged in");
        return context.redirect("/dashboard");
      }
      break;
  }

  return next();
});
