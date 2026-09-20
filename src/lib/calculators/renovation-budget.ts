import { CalculatorError, assertNonNegative } from "./shared";

export interface BudgetLineItem {
  label: string;
  low: number;
  base: number;
  high: number;
}

export interface RenovationBudgetInput {
  lineItems: BudgetLineItem[];
  /** Contingency as a percentage, allowed 0–50 (spec §55). */
  contingencyPercent: number;
  professionalFees?: number;
  permits?: number;
  temporaryAccommodation?: number;
}

export interface RenovationBudgetResult {
  itemsLow: number;
  itemsBase: number;
  itemsHigh: number;
  fixedExtras: number;
  contingencyLow: number;
  contingencyBase: number;
  contingencyHigh: number;
  totalLow: number;
  totalBase: number;
  totalHigh: number;
}

/**
 * Renovation budget worksheet (spec §12).
 * Low/base/high totals = sum of line items + fixed extras + % contingency.
 * This is a budgeting worksheet, not a market-price estimator.
 */
export function renovationBudget(
  input: RenovationBudgetInput,
): RenovationBudgetResult {
  const contingencyPercent = assertNonNegative(
    input.contingencyPercent,
    "contingency (%)",
  );
  if (contingencyPercent > 50) {
    throw new CalculatorError("Contingency is capped at 50% for this worksheet.");
  }

  let itemsLow = 0;
  let itemsBase = 0;
  let itemsHigh = 0;
  for (const [i, item] of input.lineItems.entries()) {
    const label = item.label?.trim() || `Line item ${i + 1}`;
    const low = assertNonNegative(item.low, `${label} (low)`);
    const base = assertNonNegative(item.base, `${label} (base)`);
    const high = assertNonNegative(item.high, `${label} (high)`);
    if (low > high) {
      throw new CalculatorError(`${label}: low cannot be greater than high.`);
    }
    itemsLow += low;
    itemsBase += base;
    itemsHigh += high;
  }

  const fixedExtras =
    assertNonNegative(input.professionalFees ?? 0, "professional fees") +
    assertNonNegative(input.permits ?? 0, "permits") +
    assertNonNegative(input.temporaryAccommodation ?? 0, "temporary accommodation");

  const subLow = itemsLow + fixedExtras;
  const subBase = itemsBase + fixedExtras;
  const subHigh = itemsHigh + fixedExtras;

  const factor = contingencyPercent / 100;
  const contingencyLow = subLow * factor;
  const contingencyBase = subBase * factor;
  const contingencyHigh = subHigh * factor;

  return {
    itemsLow,
    itemsBase,
    itemsHigh,
    fixedExtras,
    contingencyLow,
    contingencyBase,
    contingencyHigh,
    totalLow: subLow + contingencyLow,
    totalBase: subBase + contingencyBase,
    totalHigh: subHigh + contingencyHigh,
  };
}
