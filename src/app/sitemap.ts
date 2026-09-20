import type { MetadataRoute } from "next";
import { indexableContent } from "@/lib/content/registry";
import { absoluteUrl } from "@/config/site";

/**
 * Sitemap with only canonical, indexable URLs (spec §16). noindex pages (e.g.
 * state pages without verified data, /search) are excluded automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return indexableContent().map((entry) => ({
    url: absoluteUrl(entry.slug),
    lastModified: entry.updatedAt,
    changeFrequency: entry.category === "calculators" ? "monthly" : "monthly",
    priority: entry.slug === "/" ? 1 : entry.category === "calculators" ? 0.8 : 0.7,
  }));
}
