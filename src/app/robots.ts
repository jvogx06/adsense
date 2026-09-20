import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

/**
 * robots.txt (spec §16). Allows crawling of the public site and critical assets,
 * disallows internal search, and links the sitemap. robots.txt is not a noindex
 * mechanism — noindex is handled per-page via metadata.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search"],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: absoluteUrl("/"),
  };
}
