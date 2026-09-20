import { CalculatorError, assertNonNegative } from "./shared";
import type { BatteryProgram } from "@/lib/validation/schemas";

export interface BatteryDiscountInput {
  usableCapacityKWh: number;
  /** ISO install date; selects the applicable STC factor period. */
  installDateISO: string;
  /** Optional certificate price in A$/STC (from the market or your installer). */
  stcPrice?: number;
}

export interface BatteryDiscountResult {
  eligible: boolean;
  /** Capacity counted toward STC support (min of usable capacity and the cap). */
  stcCapacityKWh: number;
  factor: number;
  factorLabel: string;
  /** Whole STCs estimated (floored). */
  eligibleStcs: number;
  /** A$ support if a certificate price was supplied, else null. */
  estimatedSupport: number | null;
  stcPriceUsed: number | null;
  programName: string;
  effectiveFrom: string;
  checkedAt: string;
  officialUrl: string;
  recRegistryUrl: string;
  warnings: string[];
}

/** Resolve the STC factor period covering an ISO date, if any. */
export function stcFactorForDate(program: BatteryProgram, iso: string) {
  return program.stcFactorSchedule.find((p) => iso >= p.from && iso <= p.to) ?? null;
}

/**
 * Federal battery STC estimator (P0 §2).
 *
 * eligibleSTCs = floor( Σ_bands ( capacity-in-band × band.factorFraction ) × factor )
 * where capacity is counted up to `stcSupportMaxKWh`. If a certificate price is
 * given, estimated support = eligibleSTCs × price; otherwise only the STC count
 * is shown, because the dollar value depends on the certificate market.
 */
export function batteryStcEstimate(
  input: BatteryDiscountInput,
  program: BatteryProgram,
): BatteryDiscountResult {
  const warnings: string[] = [
    "Unofficial estimate. Confirm your actual STC entitlement using the REC Registry calculator and your accredited installer.",
  ];

  const capacity = assertNonNegative(input.usableCapacityKWh, "usable capacity (kWh)");

  const period = stcFactorForDate(program, input.installDateISO);
  if (!period) {
    throw new CalculatorError(
      "Select an installation date within the program's scheduled periods (2026–2030).",
    );
  }
  const factor = period.factor;

  const eligible =
    capacity >= program.eligibilityMinKWh && capacity <= program.eligibilityMaxKWh;
  if (!eligible) {
    warnings.push(
      `Eligible battery installations are nominally ${program.eligibilityMinKWh}–${program.eligibilityMaxKWh} kWh; your capacity is outside that band, so this estimate may not apply.`,
    );
  }

  // Weighted capacity via the taper, counting capacity up to the STC cap.
  const stcCapacityKWh = Math.min(capacity, program.stcSupportMaxKWh);
  let weightedKWh = 0;
  for (const band of program.capacityTaper) {
    const inBand = Math.max(0, Math.min(capacity, band.toKWh) - band.fromKWh);
    weightedKWh += inBand * band.factorFraction;
  }
  const eligibleStcs = Math.floor(weightedKWh * factor);

  let estimatedSupport: number | null = null;
  let stcPriceUsed: number | null = null;
  if (input.stcPrice !== undefined && input.stcPrice !== null && !Number.isNaN(input.stcPrice)) {
    stcPriceUsed = assertNonNegative(input.stcPrice, "STC price (A$/STC)");
    estimatedSupport = eligibleStcs * stcPriceUsed;
  } else {
    warnings.push(
      "No certificate price entered — showing the estimated STC count only. The dollar value depends on the certificate market and your installer's arrangement.",
    );
  }

  return {
    eligible,
    stcCapacityKWh,
    factor,
    factorLabel: period.label,
    eligibleStcs,
    estimatedSupport,
    stcPriceUsed,
    programName: program.name,
    effectiveFrom: program.effectiveFrom,
    checkedAt: program.checkedAt,
    officialUrl: program.officialUrl,
    recRegistryUrl: program.recRegistryUrl,
    warnings,
  };
}
