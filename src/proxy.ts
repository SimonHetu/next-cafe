import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  createApiRatelimitFromEnv,
  enforceApiRateLimit,
  getClientIp,
} from "@/src/lib/api-rate-limit";

const apiRatelimit = createApiRatelimitFromEnv();

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/products(.*)",
  "/api/webhooks(.*)",
  "/cart",
  "/checkout/(.*)",
]);

const middleware = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  const rate = await enforceApiRateLimit(
    apiRatelimit,
    req.nextUrl.pathname,
    getClientIp(req)
  );
  if (!rate.continue) {
    return rate.response;
  }

  return NextResponse.next();
});

export default middleware;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
