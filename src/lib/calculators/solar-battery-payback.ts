import {
  CalculatorError,
  assertNonNegative,
  assertPositive,
  centsToAUD,
} from "./shared";

export interface SolarBatteryPaybackInput {
  netInstalledCost: number;
  usableKWh: number;
  /** Round-trip efficiency as a percentage (0–100). */
  roundTripEfficiencyPercent: number;
  solarSurplusKWhPerDay: number;
  overnightLoadKWhPerDay: number;
  importTariffCents: number;
  feedInTariffCents: number;
  /** Annual capacity degradation as a percentage (0–100). */
  annualDegradationPercent: number;
  /** Optional annual VPP benefit in AUD. */
  vppBenefitPerYear?: number;
  /** Modelling horizon in years (default 15). */
  horizonYears?: number;
}

export interface PaybackYear {
  year: number;
  usableCapacityKWh: number;
  deliveredKWh: number;
  avoidedImport: number;
  forgoneExport: number;
  netSavings: number;
  cumulativeSavings: number;
}

export interface SolarBatteryPaybackResult {
  firstYearNetSavings: number;
  tenYearCumulativeSavings: number;
  horizonYears: number;
  /** Years to payback (may be fractional), or null if never within horizon. */
  paybackYears: number | null;
  paybackMessage: string;
  schedule: PaybackYear[];
  warnings: string[];
}

/**
 * Solar battery payback (spec §12 / §54.3 / §54.4).
 *
 * Per year n:
 *   usable_n     = usable_1 × (1 - degradation)^(n-1)
 *   charge_input = min(solar_surplus, usable_n / efficiency)
 *   delivered    = min(overnight_load, charge_input × efficiency)
 *   avoided_import = delivered × import_rate × 365
 *   forgone_export = charge_input × feed_in_rate × 365
 *   net_savings  = avoided_import - forgone_export + vpp
 * Iterate until cumulative savings >= installed cost.
 */
export function solarBatteryPayback(
  input: SolarBatteryPaybackInput,
): SolarBatteryPaybackResult {
  const warnings: string[] = [];

  const installedCost = assertNonNegative(input.netInstalledCost, "net installed cost");
  const usable1 = assertPositive(input.usableKWh, "usable battery capacity (kWh)");
  const effPct = assertPositive(
    input.roundTripEfficiencyPercent,
    "round-trip efficiency (%)",
  );
  if (effPct > 100) {
    throw new CalculatorError("Round-trip efficiency cannot be more than 100%.");
  }
  const efficiency = effPct / 100;
  const solarSurplus = assertNonNegative(
    input.solarSurplusKWhPerDay,
    "solar surplus (kWh/day)",
  );
  const overnightLoad = assertNonNegative(
    input.overnightLoadKWhPerDay,
    "overnight load (kWh/day)",
  );
  const importRate = centsToAUD(assertNonNegative(input.importTariffCents, "import tariff (c/kWh)"));
  const feedInRate = centsToAUD(
    assertNonNegative(input.feedInTariffCents, "feed-in tariff (c/kWh)"),
  );
  const degradation = assertNonNegative(
    input.annualDegradationPercent,
    "annual degradation (%)",
  );
  if (degradation >= 100) {
    throw new CalculatorError("Annual degradation must be less than 100%.");
  }
  const vpp = assertNonNegative(input.vppBenefitPerYear ?? 0, "VPP benefit per year");
  const horizonYears = Math.max(1, Math.round(input.horizonYears ?? 15));

  if (usable1 > 100) {
    warnings.push(
      "A usable capacity above 100 kWh is unusual for a home battery — check your figure.",
    );
  }
  if (solarSurplus === 0) {
    warnings.push(
      "With no daily solar surplus, this model shows no savings from shifting solar into the battery.",
    );
  }
  if (feedInRate > importRate) {
    warnings.push(
      "Your feed-in tariff is higher than your import tariff, so storing energy can reduce savings. The model handles this honestly.",
    );
  }

  const schedule: PaybackYear[] = [];
  let cumulative = 0;
  let paybackYears: number | null = null;

  for (let year = 1; year <= horizonYears; year++) {
    const usableCapacityKWh = usable1 * Math.pow(1 - degradation / 100, year - 1);
    const chargeInput = Math.min(solarSurplus, usableCapacityKWh / efficiency);
    const delivered = Math.min(overnightLoad, chargeInput * efficiency);
    const avoidedImport = delivered * importRate * 365;
    const forgoneExport = chargeInput * feedInRate * 365;
    const netSavings = avoidedImport - forgoneExport + vpp;

    const prevCumulative = cumulative;
    cumulative += netSavings;

    schedule.push({
      year,
      usableCapacityKWh,
      deliveredKWh: delivered,
      avoidedImport,
      forgoneExport,
      netSavings,
      cumulativeSavings: cumulative,
    });

    if (
      paybackYears === null &&
      prevCumulative < installedCost &&
      cumulative >= installedCost &&
      netSavings > 0
    ) {
      // Linear interpolation within the year for a fractional payback.
      const remaining = installedCost - prevCumulative;
      paybackYears = year - 1 + remaining / netSavings;
    }
  }

  const firstYearNetSavings = schedule[0]?.netSavings ?? 0;
  const tenYear = schedule[Math.min(9, schedule.length - 1)]?.cumulativeSavings ?? 0;

  let paybackMessage: string;
  if (firstYearNetSavings <= 0) {
    paybackYears = null;
    paybackMessage = "At these assumptions, the model does not reach positive payback.";
  } else if (paybackYears === null) {
    paybackMessage = `No payback within the ${horizonYears}-year model.`;
  } else {
    paybackMessage = `Estimated simple payback around ${paybackYears.toFixed(1)} years.`;
  }

  return {
    firstYearNetSavings,
    tenYearCumulativeSavings: tenYear,
    horizonYears,
    paybackYears,
    paybackMessage,
    schedule,
    warnings,
  };
}
