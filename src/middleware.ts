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
  context.locals.session = session?.session || null;
  context.locals.userSession = session?.user || null;

  // Redirect for invalid sessions
  if (!session && pathname.startsWith("/dashboard")) {
    console.error(pathname, "Unauthenticated");
    return context.redirect("/login");
  } else if (session && ["/login", "/signup"].includes(pathname)) {
    console.info(pathname, "Already logged in");
    return context.redirect("/dashboard");
  }

  return next();
});
