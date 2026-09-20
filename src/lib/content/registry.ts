import { z } from "zod";
import {
  contentCategoryEnum,
  contentIntentEnum,
  isoDate,
} from "@/lib/validation/schemas";

/**
 * Content registry — the single index of every page's metadata (its
 * "frontmatter"). Page bodies are React server components composed only from
 * the whitelisted content components; this registry centralises the metadata
 * that drives titles, canonicals, the sitemap, internal search, the "recently
 * updated" list, related-content suggestions and the cannibalisation guard.
 *
 * `index: false` keeps a page out of the sitemap and emits noindex,follow —
 * used for pages that would be thin without verified, differentiated data
 * (e.g. state pages) per spec §33/§49.4, and for utility pages.
 */
export const contentEntrySchema = z.object({
  slug: z.string(),
  title: z.string().min(1),
  /** Meta title (may differ slightly from H1). */
  metaTitle: z.string().min(1),
  description: z.string().min(1),
  category: contentCategoryEnum,
  intent: contentIntentEnum,
  primaryKeyword: z.string().min(1),
  publishedAt: isoDate,
  updatedAt: isoDate,
  sourceIds: z.array(z.string()).default([]),
  calculatorId: z.string().nullable().default(null),
  index: z.boolean().default(true),
  featured: z.boolean().default(false),
  /** Search-only aliases; never generate duplicate URLs (spec §52). */
  aliases: z.array(z.string()).default([]),
  /** Headings for search index + TOC. */
  headings: z.array(z.string()).default([]),
});
export type ContentEntry = z.infer<typeof contentEntrySchema>;

const D = "2026-09-20";

const entries: ContentEntry[] = [
  // -- Site --
  {
    slug: "/",
    title: "Home",
    metaTitle: "Australian Home Cost Calculators & Guides",
    description:
      "Independent Australian calculators and cost guides for running, repairing and improving your home — built from dated, cited sources.",
    category: "site",
    intent: "brand",
    primaryKeyword: "home cost calculators Australia",
    publishedAt: D,
    updatedAt: D,
    index: true,
    featured: false,
    aliases: [],
    sourceIds: [],
    calculatorId: null,
    headings: [],
  },

  // -- Calculators hub + tools --
  entry("/calculators", "Calculators", "Home Cost & Energy Calculators", "Every production calculator, grouped by energy, solar, renovation and trades — all run in your browser with visible assumptions.", "calculators", "tool", "home cost calculators Australia"),
  entry(
    "/calculators/air-conditioner-running-cost",
    "Air Conditioner Running Cost Calculator",
    "Air Conditioner Running Cost Calculator Australia",
    "Estimate daily, monthly and annual air-con electricity costs using your own power rating, usage and tariff. See the formula and assumptions.",
    "calculators",
    "tool",
    "air conditioner running cost calculator",
    { calculatorId: "air-conditioner-running-cost", featured: true, aliases: ["air conditioning running cost calculator"] },
  ),
  entry("/calculators/solar-battery-payback", "Solar Battery Payback Calculator", "Solar Battery Payback Calculator Australia", "Estimate simple battery payback using installed cost, usable capacity, solar surplus, electricity tariffs and efficiency assumptions.", "calculators", "tool", "solar battery payback calculator Australia", { calculatorId: "solar-battery-payback", featured: true }),
  entry("/calculators/solar-system-size", "Solar System Size Calculator", "Solar System Size Calculator Australia", "Size a solar system from your daily use, target offset and your own peak-sun-hours. No invented irradiance defaults.", "calculators", "tool", "solar system size calculator Australia", { calculatorId: "solar-system-size", featured: true }),
  entry("/calculators/electricity-usage", "Electricity Usage Calculator", "Electricity Usage Calculator Australia", "Add appliances and see daily, monthly and annual electricity costs from power, hours and your tariff.", "calculators", "tool", "electricity usage calculator", { calculatorId: "electricity-usage", featured: true }),
  entry("/calculators/ev-charging-cost", "EV Charging Cost Calculator", "EV Charging Cost Calculator Australia", "Compare home, mixed and public EV charging costs from your consumption, distance and tariffs.", "calculators", "tool", "EV charging cost calculator Australia", { calculatorId: "ev-charging-cost", featured: true }),
  entry("/calculators/pool-running-cost", "Pool Running Cost Calculator", "Pool Running Cost Calculator Australia", "Estimate pool pump and optional heater energy and running cost from your equipment and schedule.", "calculators", "tool", "pool running cost calculator Australia", { calculatorId: "pool-running-cost" }),
  entry("/calculators/home-renovation-budget", "Home Renovation Budget Calculator", "Home Renovation Budget Calculator Australia", "Build a line-item renovation budget with contingency and low, base and high scenarios.", "calculators", "tool", "renovation budget calculator Australia", { calculatorId: "home-renovation-budget", featured: true }),
  entry("/calculators/battery-discount-estimator", "Federal Battery Discount Estimator", "Federal Battery Discount Estimator (Unofficial)", "A rough, dated indicative estimate of the federal battery discount. Not an official government calculator.", "calculators", "tool", "battery rebate calculator Australia", { calculatorId: "battery-discount-estimator", sourceIds: ["dcceew-battery-program", "cer-q2-2026"] }),

  // -- Air conditioning --
  entry("/air-conditioning", "Air Conditioning Costs in Australia", "Air Conditioning Costs & Guides Australia", "Upfront, running and repair costs for ducted, split and multi-split air conditioning in Australia — with a running-cost calculator.", "air-conditioning", "informational", "air conditioning Australia costs"),
  entry("/air-conditioning/ducted-air-conditioning-cost", "Ducted Air Conditioning Cost in Australia", "Ducted Air Conditioning Cost in Australia", "Sourced 2026 ducted air conditioning cost ranges, what drives them, how running costs work, and how to compare installer quotes fairly.", "air-conditioning", "commercial-research", "ducted air conditioning cost", { sourceIds: ["ducted-total"] }),
  entry("/air-conditioning/split-system-installation-cost", "Split System Installation Cost", "Split System Air Conditioning Installation Cost", "Sourced 2026 split system cost ranges by system type, the separate installation-only labour range, and how to compare quotes.", "air-conditioning", "commercial-research", "split system installation cost", { sourceIds: ["split-total-small", "split-total-two-unit", "split-total-multi", "split-install-only"] }),
  entry("/air-conditioning/air-conditioning-repair-cost", "Air Conditioning Repair Cost", "Air Conditioning Repair & Service Cost in Australia", "Sourced 2026 air conditioning service ranges, and how service, diagnosis, repair and component replacement differ in cost.", "air-conditioning", "commercial-research", "air conditioning repair cost", { sourceIds: ["ac-service-basic", "ac-service-average", "ac-service-higher", "electrician-hourly"] }),
  entry("/air-conditioning/ducted-vs-split-system", "Ducted vs Split System: Cost Comparison", "Ducted vs Split System: Cost Comparison", "A decision guide and 10-year ownership worksheet to compare ducted and split system air conditioning by total cost.", "air-conditioning", "comparison", "ducted vs split system"),

  // -- Solar & batteries --
  entry("/solar-batteries", "Solar & Battery Costs in Australia", "Solar & Battery Costs in Australia", "Battery prices, payback, the federal program, sizing and installation — with calculators and dated sources.", "solar-batteries", "informational", "solar battery Australia cost", { sourceIds: ["dcceew-battery-program", "solarquotes-battery-cost-2026"] }),
  entry("/solar-batteries/solar-battery-cost", "Solar Battery Cost in Australia", "Solar Battery Cost in Australia", "Understand current battery price ranges, installation components, rebate context and the inputs that determine your real system cost.", "solar-batteries", "commercial-research", "solar battery cost Australia", { sourceIds: ["solar-battery-hardware", "dcceew-battery-program"] }),
  entry("/solar-batteries/solar-panel-installation-cost", "Solar Panel Installation Cost", "Solar Panel Installation Cost in Australia", "A framework for solar panel installation cost by system size, pointing to the SolarQuotes Price Explorer for observed Australian pricing.", "solar-batteries", "commercial-research", "solar panel installation cost Australia", { sourceIds: ["solarquotes-price-explorer"], index: false }),
  entry("/solar-batteries/federal-battery-program", "Cheaper Home Batteries Program Explained", "Cheaper Home Batteries Program Explained", "A plain-language summary of the federal Cheaper Home Batteries Program: eligibility, the indicative discount, changes and official sources.", "solar-batteries", "informational", "Cheaper Home Batteries Program", { sourceIds: ["dcceew-battery-program", "cer-q2-2026", "cer-record-growth-2026"] }),

  // -- Renovations --
  entry("/renovations", "Renovation Costs in Australia", "Renovation Costs in Australia", "Source-based cost ranges for bathroom, kitchen, roof and whole-home renovations, plus a budget calculator.", "renovations", "informational", "renovation costs Australia", { sourceIds: ["bathroom-reno-overall", "kitchen-reno-ballpark"] }),
  entry("/renovations/bathroom-renovation-cost", "Bathroom Renovation Cost", "Bathroom Renovation Cost in Australia", "See sourced Australian bathroom renovation cost ranges, what changes the quote and how to build a realistic low, base and high budget.", "renovations", "commercial-research", "bathroom renovation cost Australia", { sourceIds: ["bathroom-reno-overall", "bathroom-reno-budget", "bathroom-reno-standard", "bathroom-reno-premium"], aliases: ["bathroom renovation price"] }),
  entry("/renovations/kitchen-renovation-cost", "Kitchen Renovation Cost", "Kitchen Renovation Cost in Australia", "A sourced ballpark for kitchen renovation cost in Australia, what changes it, and how to plan a realistic budget.", "renovations", "commercial-research", "kitchen renovation cost Australia", { sourceIds: ["kitchen-reno-ballpark"] }),
  entry("/renovations/roof-restoration-cost", "Roof Restoration Cost", "Roof Restoration Cost in Australia", "Source-dated per-square-metre roof restoration ranges with an area worksheet and the factors that change the price.", "renovations", "commercial-research", "roof restoration cost Australia", { sourceIds: ["roof-restoration-small", "roof-restoration-medium", "roof-restoration-large"] }),
  entry("/renovations/roof-replacement-cost", "Roof Replacement Cost", "Roof Replacement Cost in Australia", "A material table and area estimator using source-dated $/m² ranges — replacement only, never mixed with restoration or repair.", "renovations", "commercial-research", "roof replacement cost Australia", { sourceIds: ["roof-replace-colorbond", "roof-replace-concrete-asphalt", "roof-replace-terracotta", "roof-replace-slate"] }),
  entry("/renovations/whole-home-renovation-cost", "Home Renovation Cost", "Whole-Home Renovation Cost in Australia", "Whole-home renovation planning with a line-item budget calculator and honest context on why quotes vary so widely.", "renovations", "commercial-research", "home renovation cost Australia", { sourceIds: ["whole-home-reno-context"] }),

  // -- Trades --
  entry("/trades", "Tradie Costs in Australia", "Tradie Costs in Australia", "How tradie pricing works — hourly rate versus call-out versus fixed quote — with sourced electrician and plumber references.", "trades", "informational", "tradie costs Australia", { sourceIds: ["plumber-hourly", "electrician-hourly"] }),
  entry("/trades/plumber-cost", "How Much Does a Plumber Cost?", "Plumber Cost in Australia: Hourly Rates & Call-Outs", "See sourced 2026 plumber rate and call-out ranges, what affects the final quote and how to compare itemised plumbing costs.", "trades", "commercial-research", "plumber cost Australia", { sourceIds: ["plumber-hourly", "plumber-callout"] }),
  entry("/trades/electrician-cost", "How Much Does an Electrician Cost?", "Electrician Cost in Australia: Rates & Service Fees", "Sourced electrician hourly rate and service-fee ranges, the factors that change a quote, and how to compare electrical work.", "trades", "commercial-research", "electrician cost Australia", { sourceIds: ["electrician-hourly", "electrician-service-fee"] }),
  entry("/trades/switchboard-upgrade-cost", "Switchboard Upgrade Cost", "Switchboard Upgrade Cost in Australia", "Sourced 2026 switchboard cost ranges by scope — hardware, installed replacement and rewiring — kept separate, plus the variables that move the price.", "trades", "commercial-research", "switchboard upgrade cost Australia", { sourceIds: ["switchboard-160a-hardware", "switchboard-250a-hardware", "switchboard-installed-12pole", "switchboard-rewiring-project"] }),

  // -- States hub (indexable) + jurisdiction pages (noindex until differentiated) --
  entry("/states", "Home Costs by State & Territory", "Home Costs by State & Territory Australia", "How home running, energy and renovation costs can differ across Australian states and territories — with links to national tools.", "states", "informational", "home costs by state Australia"),
  stateEntry("/states/nsw", "New South Wales", "home running renovation costs NSW"),
  stateEntry("/states/vic", "Victoria", "home costs Victoria"),
  stateEntry("/states/qld", "Queensland", "home costs Queensland"),
  stateEntry("/states/wa", "Western Australia", "home costs WA"),
  stateEntry("/states/sa", "South Australia", "home costs South Australia"),
  stateEntry("/states/tas", "Tasmania", "home costs Tasmania"),
  stateEntry("/states/act", "Australian Capital Territory", "home costs ACT"),
  stateEntry("/states/nt", "Northern Territory", "home costs Northern Territory"),

  // -- Trust --
  entry("/methodology", "How we calculate home costs", "Methodology: How We Calculate Home Costs", "How we collect dated sources, preserve scope, handle conflicting data, run calculators and make corrections.", "trust", "trust", "methodology"),
  entry("/sources", "Data Sources", "Data Sources & Last-Checked Dates", "Our living source registry: every organisation, type, date and the pages that use each source.", "trust", "trust", "data sources"),
  entry("/editorial-policy", "Editorial Policy", "Editorial Policy", "Our originality, sourcing, AI-assistance, corrections and advertising-independence rules.", "trust", "trust", "editorial policy"),
  entry("/about", "About", "About Home Cost Australia", "Our mission and independence — no fake team members, credentials or endorsements.", "trust", "brand", "about"),
  entry("/corrections", "Corrections Policy", "Corrections Policy", "How to report an error and how we log and publish corrections.", "trust", "trust", "corrections policy"),

  // -- Legal --
  entry("/advertising-disclosure", "Advertising Disclosure", "Advertising Disclosure", "How display advertising works on this site and how future affiliate relationships would be labelled.", "legal", "legal", "advertising disclosure", { sourceIds: ["google-adsense-policies"] }),
  entry("/privacy-policy", "Privacy Policy", "Privacy Policy", "How this site handles personal information. A template for the owner to complete with real business details before launch.", "legal", "legal", "privacy policy", { sourceIds: ["oaic-app-guidelines"] }),
  entry("/cookie-policy", "Cookie Policy", "Cookie Policy", "Cookies, analytics and advertising disclosures, and CMP requirements for EEA, UK and Switzerland visitors.", "legal", "legal", "cookie policy", { sourceIds: ["google-cmp-eea"] }),
  entry("/terms", "Terms of Use", "Terms of Use", "Informational-only terms of use. Legal review is recommended before production.", "legal", "legal", "terms of use"),
  entry("/disclaimer", "Disclaimer", "Disclaimer", "Estimates are not quotes; energy and financial assumptions can change.", "legal", "legal", "disclaimer"),
  entry("/contact", "Contact", "Contact", "How to reach us. No fake office or address; the owner sets a real contact method before launch.", "legal", "utility", "contact", { index: true }),
];

function entry(
  slug: string,
  title: string,
  metaTitle: string,
  description: string,
  category: ContentEntry["category"],
  intent: ContentEntry["intent"],
  primaryKeyword: string,
  extra: Partial<ContentEntry> = {},
): ContentEntry {
  return {
    slug,
    title,
    metaTitle,
    description,
    category,
    intent,
    primaryKeyword,
    publishedAt: D,
    updatedAt: D,
    sourceIds: extra.sourceIds ?? [],
    calculatorId: extra.calculatorId ?? null,
    index: extra.index ?? true,
    featured: extra.featured ?? false,
    aliases: extra.aliases ?? [],
    headings: extra.headings ?? [],
  };
}

/** State pages are noindex until they carry verified differentiated data (§33). */
function stateEntry(slug: string, name: string, keyword: string): ContentEntry {
  return entry(
    slug,
    `${name} Home Costs & Calculators`,
    `${name} Home Costs & Calculators`,
    `Home cost and energy context for ${name}, with links to our national calculators and guides. Local figures are added only when verified.`,
    "states",
    "informational",
    keyword,
    { index: false },
  );
}

// Validate + guard unique slugs, meta titles and descriptions at load.
const slugs = new Set<string>();
const titles = new Set<string>();
const descriptions = new Set<string>();
for (const e of entries) {
  contentEntrySchema.parse(e);
  if (slugs.has(e.slug)) throw new Error(`Duplicate content slug: ${e.slug}`);
  if (titles.has(e.metaTitle)) throw new Error(`Duplicate meta title: ${e.metaTitle}`);
  if (descriptions.has(e.description)) throw new Error(`Duplicate meta description: ${e.description}`);
  slugs.add(e.slug);
  titles.add(e.metaTitle);
  descriptions.add(e.description);
}

export const content: readonly ContentEntry[] = entries;

const bySlug = new Map(entries.map((e) => [e.slug, e]));

export function getContent(slug: string): ContentEntry {
  const e = bySlug.get(slug);
  if (!e) throw new Error(`Unknown content slug: ${slug}`);
  return e;
}

export function indexableContent(): ContentEntry[] {
  return entries.filter((e) => e.index);
}

/** Editorial categories that may surface in "Recently updated" (P1 §15). */
const EDITORIAL_CATEGORIES = new Set([
  "calculators",
  "air-conditioning",
  "solar-batteries",
  "renovations",
  "trades",
  "energy",
  "data",
]);

export function recentlyUpdated(limit = 6): ContentEntry[] {
  // Surface calculators and cost guides only — never legal/trust/config pages.
  return [...entries]
    .filter((e) => e.index && EDITORIAL_CATEGORIES.has(e.category))
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, limit);
}
