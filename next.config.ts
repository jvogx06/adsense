import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * This is a pragmatic baseline that is compatible with Google Analytics (GA4)
 * and Google AdSense/Ad Manager once those integrations are enabled. It allows
 * inline scripts/styles because Next.js injects hydration data and Tailwind
 * injects styles at build time. Before a hardened production launch the owner
 * should move to a nonce-based CSP (see README "Security headers").
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // Google Tag / Analytics / AdSense script origins.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://adservice.google.com https://fundingchoicesmessages.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.googlesyndication.com https://pagead2.googlesyndication.com",
  // Ad iframes when AdSense is enabled.
  "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://fundingchoicesmessages.google.com",
]
  .join("; ")
  .concat(";");

// Environment detection mirrors src/config/site.ts (kept inline so next.config
// needs no alias resolution). Any non-production deployment is noindex site-wide.
const productionUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
const domainConfigured = productionUrl.length > 0 && !productionUrl.includes("example.com");
const explicitEnv = process.env.NEXT_PUBLIC_SITE_ENV;
const isProduction =
  domainConfigured &&
  (explicitEnv === "production" ||
    (explicitEnv === undefined && process.env.VERCEL_ENV === "production"));

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Belt-and-braces: on staging/preview, block indexing at the header level too
  // (in addition to per-page noindex metadata).
  ...(isProduction
    ? []
    : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
