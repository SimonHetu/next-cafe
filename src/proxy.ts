import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  createApiRatelimitFromEnv,
  enforceApiRateLimit,
  getClientIp,
} from "@/src/lib/api-rate-limit";
import { edgeLog } from "@/src/lib/edge-log";

const apiRatelimit = createApiRatelimitFromEnv();

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/products(.*)",
  "/api/(.*)",
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
    edgeLog("warn", {
      reason: "api_rate_limit",
      pathname: req.nextUrl.pathname,
      ip: getClientIp(req),
    });
    return rate.response;
  }

  return NextResponse.next();
});

export default middleware;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
