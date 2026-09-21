import { siteConfig, absoluteUrl } from "@/config/site";

/**
 * JSON-LD builders (spec §15). Only properties that genuinely exist on the page
 * are emitted, and only schema types Google documents are used. No HowTo/FAQ
 * rich-result markup (deprecated / not pursued as an SEO tactic).
 */

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function organisationLd() {
  const legal = siteConfig.publisherLegalName;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    ...(legal && !legal.startsWith("{{") ? { legalName: legal } : {}),
    ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
    ...(siteConfig.socialProfiles.length
      ? { sameAs: siteConfig.socialProfiles }
      : {}),
  };
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    inLanguage: "en-AU",
  };
}

export function breadcrumbLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export interface ArticleLdInput {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  image?: string;
}

export function articleLd(input: ArticleLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@type": "Organization", name: input.authorName },
    publisher: {
      "@type": "Organization",
      name: siteConfig.siteName,
    },
    image: input.image
      ? input.image.startsWith("http")
        ? input.image
        : absoluteUrl(input.image)
      : absoluteUrl(siteConfig.defaultOgImage),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(input.slug),
    },
    inLanguage: "en-AU",
  };
}

export function webPageLd(input: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.slug),
    inLanguage: "en-AU",
    isPartOf: { "@type": "WebSite", name: siteConfig.siteName, url: siteConfig.siteUrl },
  };
}

/**
 * WebApplication for calculators (semantic only — we do not promise a rich
 * result Google does not document).
 */
export function webApplicationLd(input: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.slug),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    inLanguage: "en-AU",
  };
}
