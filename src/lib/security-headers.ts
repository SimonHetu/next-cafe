export type SecurityHeader = { key: string; value: string };

const clerkHosts =
  "https://*.clerk.com https://*.clerk.accounts.dev https://clerk.com";
const clerkWs = "wss://*.clerk.com wss://*.clerk.accounts.dev";

export function buildContentSecurityPolicy(): string {
  const scriptSrc = ["'self'", "'unsafe-inline'", clerkHosts].join(" ");
  const connectSrc = ["'self'", clerkHosts, clerkWs].join(" ");

  const directives: [string, string][] = [
    ["default-src", "'self'"],
    ["script-src", scriptSrc],
    ["style-src", "'self' 'unsafe-inline'"],
    ["img-src", "'self' data: blob: https:"],
    ["font-src", "'self' data:"],
    ["connect-src", connectSrc],
    [
      "frame-src",
      [
        "'self'",
        "https://*.clerk.com",
        "https://*.clerk.accounts.dev",
        "https://challenges.cloudflare.com",
      ].join(" "),
    ],
    ["worker-src", "'self' blob:"],
    ["object-src", "'none'"],
    ["frame-ancestors", "'none'"],
    ["base-uri", "'self'"],
    [
      "form-action",
      "'self' https://*.clerk.com https://*.clerk.accounts.dev",
    ],
  ];

  return directives.map(([k, v]) => `${k} ${v}`).join("; ");
}

const staticHeaders: SecurityHeader[] = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

export function buildSecurityHeaders(options?: { isDev?: boolean }): SecurityHeader[] {
  const isDev = options?.isDev ?? process.env.NODE_ENV === "development";
  if (isDev) {
    return [...staticHeaders];
  }
  return [
    ...staticHeaders,
    { key: "Content-Security-Policy", value: buildContentSecurityPolicy() },
  ];
}
