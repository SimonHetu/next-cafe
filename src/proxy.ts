import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = getRedis();

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/products(.*)",
  "/api/webhooks(.*)",
  "/cart",
  "/checkout/(.*)",
]);

const API_RATE_LIMIT_MAX = 60;

const apiRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(API_RATE_LIMIT_MAX, "60 s"),
      prefix: "ratelimit:api",
    })
  : null;

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    request.ip ??
    "127.0.0.1"
  );
}

function shouldRateLimitApiPath(pathname: string): boolean {
  if (!pathname.startsWith("/api")) return false;
  if (pathname.startsWith("/api/webhooks")) return false;
  return true;
}

const middleware = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  if (apiRatelimit && shouldRateLimitApiPath(req.nextUrl.pathname)) {
    const ip = clientIp(req);
    try {
      const { success } = await apiRatelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
    } catch {
      // Upstash unreachable / bad credentials — fail open.
    }
  }

  return NextResponse.next();
});

export default middleware;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
