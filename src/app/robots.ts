import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * robots.txt (spec §16, P0 §6/§18).
 *
 * Production: allow crawling of the public site, disallow internal search, link
 * the sitemap. Staging/preview: disallow everything (belt-and-braces; the real
 * noindex signals are the per-page metadata and the X-Robots-Tag header).
 * robots.txt is never the sole noindex mechanism.
 */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search"],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
