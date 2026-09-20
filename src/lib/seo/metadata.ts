import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getContent } from "@/lib/content/registry";

export interface PageMetaInput {
  title: string;
  description: string;
  /** Canonical path, e.g. "/calculators/air-conditioner-running-cost". */
  slug: string;
  /** When false, emit noindex,follow (spec §16). Defaults to true. */
  index?: boolean;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Build page metadata with a self-referencing canonical, Open Graph/Twitter
 * cards and correct robots directives (spec §14/§16). Titles/descriptions are
 * validated for uniqueness by a unit test and the prelaunch check.
 */
export function buildMetadata(input: PageMetaInput): Metadata {
  const index = input.index ?? true;
  const canonical = input.slug === "/" ? "/" : input.slug;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    robots: index
      ? { index: true, follow: true, "max-image-preview": "large" }
      : { index: false, follow: true },
    openGraph: {
      type: input.ogType ?? "website",
      url: canonical,
      title: input.title,
      description: input.description,
      siteName: siteConfig.siteName,
      locale: "en_AU",
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

/**
 * Build metadata straight from the content registry (one line per page).
 * ogType defaults to "article" for guide-style intents, "website" otherwise.
 */
export function pageMetadata(slug: string): Metadata {
  const entry = getContent(slug);
  const isArticle =
    entry.intent === "commercial-research" || entry.intent === "comparison";
  return buildMetadata({
    title: entry.metaTitle,
    description: entry.description,
    slug: entry.slug,
    index: entry.index,
    ogType: isArticle ? "article" : "website",
    publishedTime: entry.publishedAt,
    modifiedTime: entry.updatedAt,
  });
}
