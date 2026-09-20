/**
 * Central site configuration.
 *
 * Everything that must change when the brand, domain, owner or integrations
 * change lives here and is read from environment variables. No component should
 * hard-code the brand name, URL, contact details or a deployment hostname —
 * always import from here.
 *
 * Environment model (P0 §6):
 *   - `productionUrl` is the ONE canonical production origin. Canonicals,
 *     sitemap, Open Graph and structured-data URLs always use it, even on a
 *     staging deployment, so a `*.vercel.app` host never leaks into Search.
 *   - `isProduction` is true only when this deployment IS the configured
 *     production domain. Otherwise the deployment is treated as staging and the
 *     whole site is emitted `noindex, nofollow`.
 *
 * Feature flags (P0 §24): analytics/AdSense/CMP each stay OFF unless a real id
 * is configured AND we are on production. Public copy reads these flags so we
 * never claim a technology runs when it does not.
 */

function env(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

const PLACEHOLDER_HOST = "example.com";

const productionUrlRaw = env("NEXT_PUBLIC_SITE_URL") ?? `https://${PLACEHOLDER_HOST}`;
const productionUrl = productionUrlRaw.replace(/\/+$/, "");
const domainConfigured = !productionUrl.includes(PLACEHOLDER_HOST);

// Explicit override wins; otherwise infer from Vercel's environment.
const explicitEnv = env("NEXT_PUBLIC_SITE_ENV"); // "production" | "staging" | "development"
const vercelEnv = env("VERCEL_ENV"); // "production" | "preview" | "development"
const isProduction =
  domainConfigured &&
  (explicitEnv === "production" ||
    (explicitEnv === undefined && vercelEnv === "production"));

const siteEnv: "production" | "staging" | "development" = isProduction
  ? "production"
  : explicitEnv === "development" || (!explicitEnv && !vercelEnv)
    ? "development"
    : "staging";

const siteName = env("NEXT_PUBLIC_SITE_NAME") ?? "Home Cost Australia";

// Legal operator name. Falls back to the brand name so a raw "{{…}}" token is
// NEVER rendered to a visitor. `legalNameConfigured` gates the prelaunch check.
const legalNameConfigured = Boolean(env("PUBLISHER_LEGAL_NAME"));
const publisherLegalName = env("PUBLISHER_LEGAL_NAME") ?? siteName;

const contactEmail = env("NEXT_PUBLIC_CONTACT_EMAIL") ?? "";
const contactConfigured = contactEmail.length > 0;

// The site's real AdSense publisher id (public, not a secret — it appears in
// the page source of every AdSense site). Env-overridable so it can change
// without a code edit.
const DEFAULT_ADSENSE_CLIENT = "ca-pub-4215967644827651";
const adsenseClient = env("NEXT_PUBLIC_ADSENSE_CLIENT") ?? DEFAULT_ADSENSE_CLIENT;
const adsenseClientValid = /^ca-pub-\d{16}$/.test(adsenseClient);
const gaMeasurementId = env("NEXT_PUBLIC_GA_MEASUREMENT_ID");

export const siteConfig = {
  siteName,
  shortName: "HomeCostAU",

  /** The canonical production origin — used for every indexable URL. */
  siteUrl: productionUrl,
  productionUrl,
  domainConfigured,
  siteEnv,
  isProduction,

  country: "Australia",
  countryCode: "AU",
  locale: "en-AU",
  currency: "AUD",

  tagline: "Know what your Australian home costs to run, repair and improve.",
  subTagline:
    "Independent calculators and cost guides built from dated Australian sources.",
  description:
    "Independent Australian calculators and cost guides for running, repairing and improving your home — built from dated, cited sources with visible methodology.",

  contactEmail,
  contactConfigured,
  publisherName: siteName,
  publisherLegalName,
  legalNameConfigured,

  socialProfiles: [] as string[],
  defaultOgImage: "/opengraph-image",

  // --- Integration ids ---
  adsenseClient,
  gaMeasurementId,
  googleSiteVerification: env("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),

  // --- Feature flags (P0 §24). Each requires production + a real id. ---
  /** GA4 available (still consent-gated at runtime). */
  analyticsEnabled: Boolean(gaMeasurementId) && isProduction,
  /**
   * Load the AdSense account/verification loader script (adsbygoogle.js).
   * This is what Google fetches to verify site ownership and review the site,
   * so it loads whenever a valid publisher id is present and we are NOT in local
   * development — independent of whether ad UNITS are enabled. It renders no ads
   * and no Auto Ads by itself.
   */
  adsenseScriptEnabled: adsenseClientValid && siteEnv !== "development",
  /** True when a valid publisher id is configured. */
  adsenseAccountConnected: adsenseClientValid,
  /** Ad UNITS available: valid id, explicit enable, and production. */
  adsenseEnabled:
    adsenseClientValid && env("NEXT_PUBLIC_ADSENSE_ENABLED") === "true" && isProduction,
  /** A certified CMP is connected (never a self-built banner claiming certification). */
  cmpEnabled: env("NEXT_PUBLIC_CMP_ENABLED") === "true" && isProduction,

  /** Dev-only ad placeholders (never in production, never a live ad). */
  showAdPlaceholders: env("NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS") === "true" && !isProduction,
} as const;

export type SiteConfig = typeof siteConfig;

/** Absolute URL on the canonical production origin. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${clean === "/" ? "" : clean}`;
}

/**
 * Robots directives for a page, honouring the environment. On any non-production
 * deployment the whole site is noindex,nofollow so staging never competes in
 * Search. On production, per-page indexability decides.
 */
export function robotsFor(indexable: boolean): {
  index: boolean;
  follow: boolean;
} {
  if (!siteConfig.isProduction) return { index: false, follow: false };
  return { index: indexable, follow: true };
}
