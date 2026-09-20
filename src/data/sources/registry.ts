import {
  assertValid,
  sourceRecordSchema,
  type SourceRecord,
} from "@/lib/validation/schemas";

/**
 * Source registry — every numeric or regulatory fact traces to one entry here.
 *
 * Each source appears exactly once. `checkedAt` is the date a human last
 * confirmed the source page. Reference/policy sources (referenceOnly) back the
 * trust/legal pages and are allowed to exist without a cost page citing them.
 *
 * Do NOT invent URLs, dates or organisations. When adding a new figure, add its
 * source here first, then reference it by `id` from a CostDatum or page.
 */
const CHECKED = "2026-09-20";

const records: SourceRecord[] = [
  // --- Renovation & trade cost references (hipages, commercial marketplace) ---
  {
    id: "hipages-bathroom-2026",
    title: "How much does a bathroom renovation cost?",
    organisation: "hipages",
    url: "https://hipages.com.au/article/how_much_does_bathroom_renovation_cost",
    sourceType: "publisher",
    updatedAt: "2026-01-21",
    checkedAt: CHECKED,
    notes:
      "Commercial marketplace guide. National ranges; show date and scope, treat as one dated reference, not an official average.",
  },
  {
    id: "hipages-kitchen-2026",
    title: "How much does a kitchen renovation cost?",
    organisation: "hipages",
    url: "https://hipages.com.au/article/how_much_does_kitchen_renovation_cost",
    sourceType: "publisher",
    publishedAt: "2026",
    checkedAt: CHECKED,
    notes: "Ballpark figures from a commercial marketplace guide.",
  },
  {
    id: "hipages-plumber-2026",
    title: "How much does a plumber cost?",
    organisation: "hipages",
    url: "https://hipages.com.au/article/how_much_does_a_plumber_cost",
    sourceType: "publisher",
    publishedAt: "2026",
    checkedAt: CHECKED,
  },
  {
    id: "hipages-electrician-2026",
    title: "How much does an electrician cost?",
    organisation: "hipages",
    url: "https://hipages.com.au/article/how_much_does_an_electrician_cost",
    sourceType: "publisher",
    publishedAt: "2026",
    checkedAt: CHECKED,
  },
  {
    id: "hipages-roof-restoration-2026",
    title: "How much does roof restoration cost?",
    organisation: "hipages",
    url: "https://hipages.com.au/article/how_much_does_roof_restoration_cost",
    sourceType: "publisher",
    publishedAt: "2026",
    checkedAt: CHECKED,
  },
  {
    id: "hipages-roof-replacement-2026",
    title: "How much does roof replacement cost?",
    organisation: "hipages",
    url: "https://hipages.com.au/article/how_much_does_roof_replacement_cost",
    sourceType: "publisher",
    publishedAt: "2026",
    checkedAt: CHECKED,
  },
  {
    id: "hipages-home-renovation-2026",
    title: "The rising cost of home renovations",
    organisation: "hipages",
    url: "https://hipages.com.au/article/the_rising_cost_of_home_renovations",
    sourceType: "publisher",
    publishedAt: "2026",
    checkedAt: CHECKED,
  },

  // --- Solar & battery ---
  {
    id: "solarquotes-battery-cost-2026",
    title: "Solar battery prices and system costs",
    organisation: "SolarQuotes",
    url: "https://www.solarquotes.com.au/battery-storage/cost/",
    sourceType: "publisher",
    updatedAt: "2026-05",
    checkedAt: CHECKED,
    notes:
      "Specialist publisher. Market context only; note rebate/GST and installation caveats. Never present as a generic quote.",
  },
  {
    id: "dcceew-battery-program",
    title: "Cheaper Home Batteries Program",
    organisation:
      "Department of Climate Change, Energy, the Environment and Water (DCCEEW)",
    url: "https://www.dcceew.gov.au/energy/programs/cheaper-home-batteries",
    sourceType: "government",
    checkedAt: CHECKED,
    notes:
      "Primary source for federal battery program rules, eligibility and effective dates.",
  },
  {
    id: "cer-record-growth-2026",
    title:
      "Record solar and battery growth shows clean energy transition accelerating (August 2026)",
    organisation: "Clean Energy Regulator (CER)",
    url: "https://cer.gov.au/news-and-media/media/2026/august/record-solar-and-battery-growth-shows-clean-energy-transition-accelerating",
    sourceType: "regulator",
    publishedAt: "2026-08",
    checkedAt: CHECKED,
  },
  {
    id: "cer-q2-2026",
    title: "Consumer energy resources — quarterly report, June quarter 2026",
    organisation: "Clean Energy Regulator (CER)",
    url: "https://cer.gov.au/markets/reports-and-data/quarterly-carbon-market-reports/quarterly-carbon-market-report-june-quarter-2026/consumer-energy-resources",
    sourceType: "regulator",
    publishedAt: "2026",
    checkedAt: CHECKED,
  },

  // --- Reference / policy (back the trust & legal pages) ---
  {
    id: "iab-au-fy26",
    title:
      "Internet advertising records strongest growth in four years, reaching $19.8 billion in FY26",
    organisation: "IAB Australia",
    url: "https://www.iabaustralia.com.au/news/internet-advertising-records-strongest-growth-in-four-years-reaching-19-8-billion-in-fy26/",
    sourceType: "industry",
    publishedAt: "2026",
    checkedAt: CHECKED,
    referenceOnly: true,
    notes: "Market-sizing context for positioning; not shown as a consumer cost.",
  },
  {
    id: "oaic-app-guidelines",
    title: "Australian Privacy Principles guidelines",
    organisation: "Office of the Australian Information Commissioner (OAIC)",
    url: "https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines",
    sourceType: "government",
    checkedAt: CHECKED,
    referenceOnly: true,
  },
  {
    id: "google-adsense-policies",
    title: "AdSense Program policies",
    organisation: "Google",
    url: "https://support.google.com/adsense/answer/48182",
    sourceType: "policy",
    checkedAt: CHECKED,
    referenceOnly: true,
  },
  {
    id: "google-cmp-eea",
    title: "CMP requirements for serving ads in the EEA, UK and Switzerland",
    organisation: "Google",
    url: "https://support.google.com/adsense/answer/13554116",
    sourceType: "policy",
    checkedAt: CHECKED,
    referenceOnly: true,
  },
];

// Validate every record and guard against duplicate ids at module load.
const seen = new Set<string>();
for (const record of records) {
  assertValid(sourceRecordSchema, record, `source "${record.id}"`);
  if (seen.has(record.id)) {
    throw new Error(`Duplicate source id: ${record.id}`);
  }
  seen.add(record.id);
}

export const sources: readonly SourceRecord[] = records;

const sourceById = new Map(records.map((r) => [r.id, r]));

export function getSource(id: string): SourceRecord | undefined {
  return sourceById.get(id);
}

/** Throwing lookup for build-time use where a missing source is a hard error. */
export function requireSource(id: string): SourceRecord {
  const record = sourceById.get(id);
  if (!record) {
    throw new Error(`Unknown source id: ${id}`);
  }
  return record;
}
