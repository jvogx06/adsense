/**
 * Central site configuration.
 *
 * Everything that must change when the brand, domain, owner or integrations
 * change lives here and is read from environment variables where relevant.
 * No component should hard-code the brand name, URL or contact details — always
 * import from here so a rebrand or domain migration is a one-file change.
 */

function env(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

const siteUrlRaw = env("NEXT_PUBLIC_SITE_URL") ?? "https://example.com";
// Normalise: no trailing slash.
const siteUrl = siteUrlRaw.replace(/\/+$/, "");

const adsenseClient = env("NEXT_PUBLIC_ADSENSE_CLIENT");

export const siteConfig = {
  /** Provisional public brand name (working name). */
  siteName: env("NEXT_PUBLIC_SITE_NAME") ?? "Home Cost Australia",
  shortName: "HomeCostAU",
  siteUrl,
  country: "Australia",
  countryCode: "AU",
  locale: "en-AU",
  currency: "AUD",

  /** Brand promise, shown on the homepage and in metadata fallbacks. */
  tagline: "Know what your Australian home costs to run, repair and improve.",
  subTagline:
    "Independent calculators and cost guides built from dated Australian sources.",
  description:
    "Independent Australian calculators and cost guides for running, repairing and improving your home — built from dated, cited sources with visible methodology.",

  /** Publisher identity. Blank until the owner completes real details. */
  contactEmail: env("NEXT_PUBLIC_CONTACT_EMAIL") ?? "",
  publisherName: env("NEXT_PUBLIC_SITE_NAME") ?? "Home Cost Australia",
  publisherLegalName: env("PUBLISHER_LEGAL_NAME") ?? "{{PUBLISHER_LEGAL_NAME}}",

  /** Social profiles — add real URLs only. Empty = not shown. */
  socialProfiles: [] as string[],

  /** Default Open Graph image path (generated route). */
  defaultOgImage: "/opengraph-image",

  /** Google integrations. All optional; blank = disabled. */
  adsenseClient,
  adsenseEnabled:
    env("NEXT_PUBLIC_ADSENSE_ENABLED") === "true" && Boolean(adsenseClient),
  showAdPlaceholders: env("NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS") === "true",
  gaMeasurementId: env("NEXT_PUBLIC_GA_MEASUREMENT_ID"),
  googleSiteVerification: env("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),
} as const;

export type SiteConfig = typeof siteConfig;

/** Absolute URL helper built from the configured origin. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${clean === "/" ? "" : clean}`;
}
