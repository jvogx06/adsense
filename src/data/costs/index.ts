import {
  assertValid,
  costDatumSchema,
  type CostDatum,
} from "@/lib/validation/schemas";
import { requireSource } from "@/data/sources/registry";

/**
 * Quantitative cost data. Every record traces to a source id and records its
 * scope, what it includes/excludes and a confidence level. These are the exact
 * figures cited in the master spec's "permitted initial data" — no figure is
 * invented to fill space, and datasets with different scopes are kept separate
 * rather than blended into a fabricated average.
 */
const CHECKED = "2026-09-20";

const data: CostDatum[] = [
  // --- Bathroom renovation (hipages, national) ---
  {
    id: "bathroom-reno-overall",
    category: "renovations",
    metric: "Bathroom renovation (overall range)",
    geography: "AU",
    unit: "AUD",
    low: 8000,
    high: 35000,
    representation: "range",
    scope:
      "Whole-project cost for a typical Australian bathroom renovation as published in a national marketplace guide. Above this range for premium work.",
    includes: ["Typical labour and materials for a standard bathroom scope"],
    excludes: [
      "Major structural change",
      "Significant plumbing relocation",
      "GST treatment not itemised by the source",
    ],
    sourceId: "hipages-bathroom-2026",
    sourceDate: "2026-01-21",
    checkedAt: CHECKED,
    confidence: "medium",
  },
  {
    id: "bathroom-reno-budget",
    category: "renovations",
    metric: "Bathroom renovation — budget tier",
    geography: "AU",
    unit: "AUD",
    low: 8000,
    high: 15000,
    representation: "range",
    scope: "Budget-tier bathroom renovation band from the same national guide.",
    includes: ["Basic finishes and like-for-like fixtures"],
    excludes: ["Premium tiling/fixtures", "Layout changes"],
    sourceId: "hipages-bathroom-2026",
    sourceDate: "2026-01-21",
    checkedAt: CHECKED,
    confidence: "medium",
  },
  {
    id: "bathroom-reno-standard",
    category: "renovations",
    metric: "Bathroom renovation — standard tier",
    geography: "AU",
    unit: "AUD",
    low: 15000,
    high: 35000,
    representation: "range",
    scope: "Standard-tier bathroom renovation band from the same national guide.",
    includes: ["Mid-range finishes", "New fixtures and tiling"],
    excludes: ["Premium/imported finishes", "Structural change"],
    sourceId: "hipages-bathroom-2026",
    sourceDate: "2026-01-21",
    checkedAt: CHECKED,
    confidence: "medium",
  },
  {
    id: "bathroom-reno-premium",
    category: "renovations",
    metric: "Bathroom renovation — premium tier",
    geography: "AU",
    unit: "AUD",
    low: 35000,
    representation: "example",
    scope:
      "Premium bathroom renovations start above the standard band; the source gives no upper bound.",
    includes: ["Premium finishes", "Custom joinery/fixtures"],
    excludes: ["Upper bound (open-ended in source)"],
    sourceId: "hipages-bathroom-2026",
    sourceDate: "2026-01-21",
    checkedAt: CHECKED,
    confidence: "low",
  },

  // --- Kitchen renovation ---
  {
    id: "kitchen-reno-ballpark",
    category: "renovations",
    metric: "Kitchen renovation (ballpark)",
    geography: "AU",
    unit: "AUD",
    low: 30000,
    high: 50000,
    representation: "range",
    scope:
      "Ballpark whole-kitchen renovation figure from the selected national guide. Other sources use different scopes; do not merge silently.",
    includes: ["Cabinetry, benchtops, appliances and labour for a typical scope"],
    excludes: ["Structural change", "GST treatment not itemised by the source"],
    sourceId: "hipages-kitchen-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "low",
  },

  // --- Plumber ---
  {
    id: "plumber-hourly",
    category: "trades",
    metric: "Plumber hourly rate",
    geography: "AU",
    unit: "AUD/hour",
    low: 80,
    high: 200,
    representation: "range",
    scope: "Typical plumber hourly rate range from a national cost guide.",
    includes: ["Labour"],
    excludes: ["Parts/materials", "Call-out fee (separate)"],
    sourceId: "hipages-plumber-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "medium",
  },
  {
    id: "plumber-callout",
    category: "trades",
    metric: "Plumber call-out fee",
    geography: "AU",
    unit: "AUD",
    low: 60,
    high: 250,
    representation: "range",
    scope: "Typical plumber call-out fee range from a national cost guide.",
    includes: ["Attendance/first visit"],
    excludes: ["Hourly labour beyond the call-out", "Parts"],
    sourceId: "hipages-plumber-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "medium",
  },

  // --- Electrician ---
  {
    id: "electrician-hourly",
    category: "trades",
    metric: "Electrician hourly rate",
    geography: "AU",
    unit: "AUD/hour",
    low: 80,
    high: 100,
    representation: "range",
    scope: "Typical electrician hourly rate range from a national cost guide.",
    includes: ["Labour"],
    excludes: ["Parts/materials", "Service/call-out fee (separate)"],
    sourceId: "hipages-electrician-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "medium",
  },
  {
    id: "electrician-service-fee",
    category: "trades",
    metric: "Electrician service/call-out fee",
    geography: "AU",
    unit: "AUD",
    low: 80,
    high: 130,
    representation: "range",
    scope: "Typical electrician service/call-out fee range from a national cost guide.",
    includes: ["Attendance/first visit"],
    excludes: ["Hourly labour beyond the fee", "Parts"],
    sourceId: "hipages-electrician-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "medium",
  },

  // --- Roof restoration ($/m², decreases with area) ---
  {
    id: "roof-restoration-small",
    category: "renovations",
    metric: "Roof restoration — small roof",
    geography: "AU",
    unit: "AUD/m2",
    low: 28,
    high: 38,
    representation: "range",
    scope:
      "Per-square-metre roof RESTORATION range for a small roof (cleaning, repairs, re-coating). Not a full roof replacement.",
    includes: ["Restoration labour and coating for a small roof"],
    excludes: ["Roof replacement", "Structural repair", "Material-only pricing"],
    sourceId: "hipages-roof-restoration-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "medium",
  },
  {
    id: "roof-restoration-medium",
    category: "renovations",
    metric: "Roof restoration — medium roof",
    geography: "AU",
    unit: "AUD/m2",
    low: 22,
    high: 28,
    representation: "range",
    scope:
      "Per-square-metre roof RESTORATION range for a medium roof. Not a full roof replacement.",
    includes: ["Restoration labour and coating for a medium roof"],
    excludes: ["Roof replacement", "Structural repair", "Material-only pricing"],
    sourceId: "hipages-roof-restoration-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "medium",
  },
  {
    id: "roof-restoration-large",
    category: "renovations",
    metric: "Roof restoration — larger roof",
    geography: "AU",
    unit: "AUD/m2",
    low: 17,
    high: 22,
    representation: "range",
    scope:
      "Per-square-metre roof RESTORATION range for a larger roof (rate falls with area). Not a full roof replacement.",
    includes: ["Restoration labour and coating for a larger roof"],
    excludes: ["Roof replacement", "Structural repair", "Material-only pricing"],
    sourceId: "hipages-roof-restoration-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "medium",
  },

  // --- Roof replacement (material-labelled $/m²) ---
  {
    id: "roof-replace-colorbond",
    category: "renovations",
    metric: "Roof replacement — Colorbond/metal",
    geography: "AU",
    unit: "AUD/m2",
    low: 18,
    high: 37,
    representation: "range",
    scope:
      "Per-square-metre range for Colorbond/metal roof REPLACEMENT as cited in the guide. Confirm whether the quote is installed vs material-only.",
    includes: ["Material range per m² as cited"],
    excludes: [
      "Restoration (different scope)",
      "Removal/disposal unless quoted",
      "Structural repair",
    ],
    sourceId: "hipages-roof-replacement-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "low",
  },
  {
    id: "roof-replace-concrete-asphalt",
    category: "renovations",
    metric: "Roof replacement — concrete/asphalt",
    geography: "AU",
    unit: "AUD/m2",
    low: 40,
    high: 60,
    representation: "range",
    scope:
      "Per-square-metre range for concrete/asphalt roof REPLACEMENT as cited in the guide.",
    includes: ["Material range per m² as cited"],
    excludes: ["Restoration (different scope)", "Removal/disposal unless quoted"],
    sourceId: "hipages-roof-replacement-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "low",
  },
  {
    id: "roof-replace-terracotta",
    category: "renovations",
    metric: "Roof replacement — terracotta tile",
    geography: "AU",
    unit: "AUD/m2",
    low: 80,
    high: 120,
    representation: "range",
    scope:
      "Per-square-metre range for terracotta tile roof REPLACEMENT as cited in the guide.",
    includes: ["Material range per m² as cited"],
    excludes: ["Restoration (different scope)", "Removal/disposal unless quoted"],
    sourceId: "hipages-roof-replacement-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "low",
  },
  {
    id: "roof-replace-slate",
    category: "renovations",
    metric: "Roof replacement — slate",
    geography: "AU",
    unit: "AUD/m2",
    low: 200,
    high: 500,
    representation: "range",
    scope:
      "Per-square-metre range for slate roof REPLACEMENT as cited in the guide.",
    includes: ["Material range per m² as cited"],
    excludes: ["Restoration (different scope)", "Removal/disposal unless quoted"],
    sourceId: "hipages-roof-replacement-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "low",
  },

  // --- Whole-home renovation (context only) ---
  {
    id: "whole-home-reno-context",
    category: "renovations",
    metric: "Large/whole-home renovation (context)",
    geography: "AU",
    unit: "AUD",
    low: 100000,
    high: 300000,
    representation: "example",
    scope:
      "Context range for larger whole-home renovations from a national guide; can exceed the upper figure. Use as context, not a quote.",
    includes: ["Multiple rooms/structural scope (varies widely)"],
    excludes: ["Upper bound (open-ended in source)"],
    sourceId: "hipages-home-renovation-2026",
    sourceDate: "2026",
    checkedAt: CHECKED,
    confidence: "low",
  },

  // --- Solar battery hardware (market context) ---
  {
    id: "solar-battery-hardware",
    category: "solar-batteries",
    metric: "Home battery hardware (market context)",
    geography: "AU",
    unit: "AUD",
    low: 4000,
    high: 13000,
    representation: "range",
    scope:
      "Approximate battery hardware price context by storage size/brand from a specialist May 2026 guide. Can exceed the upper figure. Market context only, never a generic quote.",
    includes: ["Battery hardware (indicative)"],
    excludes: [
      "Installation labour",
      "Federal/state rebates",
      "GST treatment varies — see source caveats",
    ],
    sourceId: "solarquotes-battery-cost-2026",
    sourceDate: "2026-05",
    checkedAt: CHECKED,
    confidence: "low",
  },
];

// Validate + guard against duplicate ids and dangling source references.
const seen = new Set<string>();
for (const datum of data) {
  assertValid(costDatumSchema, datum, `cost datum "${datum.id}"`);
  if (seen.has(datum.id)) {
    throw new Error(`Duplicate cost datum id: ${datum.id}`);
  }
  seen.add(datum.id);
  // Throws if the source id does not exist.
  requireSource(datum.sourceId);
}

export const costData: readonly CostDatum[] = data;

const byId = new Map(data.map((d) => [d.id, d]));

export function getCostDatum(id: string): CostDatum | undefined {
  return byId.get(id);
}

export function requireCostDatum(id: string): CostDatum {
  const datum = byId.get(id);
  if (!datum) {
    throw new Error(`Unknown cost datum id: ${id}`);
  }
  return datum;
}

export function costDataByCategory(category: string): CostDatum[] {
  return data.filter((d) => d.category === category);
}
