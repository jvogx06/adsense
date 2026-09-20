export interface QuoteInput {
  label: string;
  totalCost: number;
  inclusions: string[];
  warrantyYears?: number;
  /** Units / zones / m² for per-unit normalisation, when meaningful. */
  units?: number;
}

export interface QuoteComparisonRow {
  label: string;
  totalCost: number;
  warrantyYears?: number;
  units?: number;
  costPerUnit?: number;
  /** Inclusions present in some other quote but missing from this one. */
  missingInclusions: string[];
}

export interface QuoteComparisonResult {
  rows: QuoteComparisonRow[];
  allInclusions: string[];
  canNormalisePerUnit: boolean;
}

/**
 * Quote comparison worksheet (spec §12).
 * User-entered data only. Normalises cost per unit ONLY when every quote gives
 * a positive unit count. Never ranks a "best" quote and never fabricates a
 * market average — it just surfaces comparable facts and missing inclusions.
 */
export function compareQuotes(quotes: QuoteInput[]): QuoteComparisonResult {
  const cleaned = quotes.filter((q) => q && (q.label?.trim() || q.totalCost > 0));

  const inclusionSet = new Set<string>();
  for (const q of cleaned) {
    for (const inc of q.inclusions ?? []) {
      const t = inc.trim();
      if (t) inclusionSet.add(t);
    }
  }
  const allInclusions = [...inclusionSet];

  const canNormalisePerUnit =
    cleaned.length > 0 &&
    cleaned.every((q) => typeof q.units === "number" && q.units > 0);

  const rows: QuoteComparisonRow[] = cleaned.map((q, i) => {
    const own = new Set((q.inclusions ?? []).map((s) => s.trim()).filter(Boolean));
    return {
      label: q.label?.trim() || `Quote ${i + 1}`,
      totalCost: q.totalCost,
      warrantyYears: q.warrantyYears,
      units: q.units,
      costPerUnit:
        canNormalisePerUnit && q.units ? q.totalCost / q.units : undefined,
      missingInclusions: allInclusions.filter((inc) => !own.has(inc)),
    };
  });

  return { rows, allInclusions, canNormalisePerUnit };
}
