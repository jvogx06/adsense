import { assertNonNegative, assertPositive } from "./shared";

export interface RoofReplacementInput {
  areaM2: number;
  /** Per-m² material range, taken from a dated source datum. */
  lowPerM2: number;
  highPerM2: number;
}

export interface RoofReplacementResult {
  low: number;
  high: number;
  /** Arithmetic midpoint — a reference only, NOT an observed average (spec §54.5). */
  referenceMidpoint: number;
}

/**
 * Roof replacement RANGE estimator (spec §12).
 * Range = area × source-specific low/high $/m². Each material dataset labels
 * exactly what its range represents; never blend material-only / repair /
 * reroof / installed-new ranges.
 */
export function roofReplacementRange(
  input: RoofReplacementInput,
): RoofReplacementResult {
  const area = assertPositive(input.areaM2, "roof area (m²)");
  const low = assertNonNegative(input.lowPerM2, "low rate ($/m²)");
  const high = assertNonNegative(input.highPerM2, "high rate ($/m²)");
  const lowTotal = area * low;
  const highTotal = area * high;
  return {
    low: lowTotal,
    high: highTotal,
    referenceMidpoint: (lowTotal + highTotal) / 2,
  };
}
