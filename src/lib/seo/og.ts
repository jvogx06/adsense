import { absoluteUrl } from "@/config/site";
import type { ContentEntry } from "@/lib/content/registry";

/**
 * Open Graph / Discover image helpers (§8).
 *
 * Every page gets a strong 1200×630 (16:9-ish) social image. A page may supply
 * its own `heroImage`; otherwise we generate a branded title card via the
 * dynamic `/api/og` route. We never use the bare logo as the main editorial
 * image, and alt text is meaningful (from `heroAlt`/title).
 */
const CLUSTER_LABEL: Record<string, string> = {
  "air-conditioning": "Air Conditioning",
  "solar-batteries": "Solar & Batteries",
  renovations: "Renovations",
  trades: "Tradie Costs",
  states: "States & Territories",
  calculators: "Calculators",
  energy: "Energy",
  data: "Data",
  trust: "About & Methodology",
  legal: "Legal",
  site: "Home Cost Australia",
};

export function clusterLabel(category: string): string {
  return CLUSTER_LABEL[category] ?? "Home Cost Australia";
}

export function ogImageUrl(opts: {
  title: string;
  eyebrow?: string;
  heroImage?: string | null;
}): string {
  if (opts.heroImage) return absoluteUrl(opts.heroImage);
  const params = new URLSearchParams({ title: opts.title });
  if (opts.eyebrow) params.set("eyebrow", opts.eyebrow);
  return absoluteUrl(`/api/og?${params.toString()}`);
}

export interface OgImageMeta {
  url: string;
  alt: string;
}

export function ogImageForEntry(entry: ContentEntry): OgImageMeta {
  return {
    url: ogImageUrl({
      title: entry.title,
      eyebrow: clusterLabel(entry.category),
      heroImage: entry.heroImage,
    }),
    alt: entry.heroAlt ?? entry.title,
  };
}
