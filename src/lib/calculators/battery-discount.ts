import { assertNonNegative } from "./shared";
import type { BatteryProgram } from "@/lib/validation/schemas";

export interface BatteryDiscountInput {
  usableCapacityKWh: number;
  eligibleInstalledQuote: number;
  /**
   * "indicative": estimate the discount from the program's dated percentage.
   * "manual": the user enters the discount amount they were actually quoted.
   */
  mode: "indicative" | "manual";
  /** Required when mode = "manual". */
  manualDiscountAmount?: number;
}

export interface BatteryDiscountResult {
  eligible: boolean;
  discountAmount: number;
  netCostAfterDiscount: number;
  percentApplied: number;
  isIndicative: boolean;
  programName: string;
  effectiveFrom: string;
  checkedAt: string;
  officialUrl: string;
  warnings: string[];
}

/**
 * Federal battery discount ESTIMATOR (spec §12 / §36).
 *
 * The percentage is NEVER hard-coded — it is read from the dated program
 * dataset. Output is explicitly "rough indicative" and always shown with the
 * effective date and an "not an official government calculator" notice.
 */
export function batteryDiscountEstimate(
  input: BatteryDiscountInput,
  program: BatteryProgram,
): BatteryDiscountResult {
  const warnings: string[] = [
    "This is not an official government calculator. Confirm current rules and your exact entitlement with DCCEEW and your installer.",
  ];

  const capacity = assertNonNegative(input.usableCapacityKWh, "usable capacity (kWh)");
  const quote = assertNonNegative(input.eligibleInstalledQuote, "eligible installed quote");

  const eligible =
    capacity >= program.capacityEligibilityMinKWh &&
    capacity <= program.capacityEligibilityMaxKWh;
  if (!eligible) {
    warnings.push(
      `The dataset lists eligibility for roughly ${program.capacityEligibilityMinKWh}–${program.capacityEligibilityMaxKWh} kWh. Your capacity is outside that band, so the estimate may not apply.`,
    );
  }

  let discountAmount: number;
  let percentApplied: number;
  let isIndicative: boolean;

  if (input.mode === "manual") {
    discountAmount = assertNonNegative(
      input.manualDiscountAmount ?? 0,
      "quoted discount amount",
    );
    percentApplied = quote > 0 ? (discountAmount / quote) * 100 : 0;
    isIndicative = false;
  } else {
    percentApplied = program.indicativeDiscountPercent;
    discountAmount = quote * (percentApplied / 100);
    isIndicative = true;
    warnings.push(
      `Indicative only: applies a dated ${program.headlineSupport}. The real figure depends on the current STC-style formula and market prices.`,
    );
  }

  return {
    eligible,
    discountAmount,
    netCostAfterDiscount: Math.max(0, quote - discountAmount),
    percentApplied,
    isIndicative,
    programName: program.name,
    effectiveFrom: program.effectiveFrom,
    checkedAt: program.checkedAt,
    officialUrl: program.officialUrl,
    warnings,
  };
}
