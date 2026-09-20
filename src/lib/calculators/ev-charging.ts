import {
  CalculatorError,
  assertNonNegative,
  assertPositive,
  centsToAUD,
} from "./shared";

export interface EvChargingInput {
  /** Vehicle energy use at the battery in kWh per 100 km. */
  consumptionKWhPer100km: number;
  kmPerWeek: number;
  homeTariffCents: number;
  publicTariffCents: number;
  /** Share of charging done at home, 0–100. */
  homeSharePercent: number;
  /** Charging losses as a percentage, 0–<100. */
  chargingLossPercent: number;
}

export interface EvChargingResult {
  kmPerYear: number;
  energyAtBatteryKWhPerYear: number;
  gridKWhPerYear: number;
  weightedTariffAUD: number;
  annualCostMixed: number;
  annualCostHomeOnly: number;
  annualCostPublicOnly: number;
  warnings: string[];
}

/**
 * EV charging cost (spec §12).
 * grid kWh = (km/year × consumption/100) / (1 - loss).
 * weighted tariff = home_share × home_rate + public_share × public_rate.
 */
export function evChargingCost(input: EvChargingInput): EvChargingResult {
  const warnings: string[] = [];

  const consumption = assertPositive(
    input.consumptionKWhPer100km,
    "consumption (kWh/100km)",
  );
  const kmPerWeek = assertNonNegative(input.kmPerWeek, "distance (km/week)");
  const homeRate = centsToAUD(assertNonNegative(input.homeTariffCents, "home tariff (c/kWh)"));
  const publicRate = centsToAUD(
    assertNonNegative(input.publicTariffCents, "public tariff (c/kWh)"),
  );
  const homeShare = assertNonNegative(input.homeSharePercent, "home charging share (%)");
  if (homeShare > 100) {
    throw new CalculatorError("Home charging share cannot be more than 100%.");
  }
  const loss = assertNonNegative(input.chargingLossPercent, "charging losses (%)");
  if (loss >= 100) {
    throw new CalculatorError("Charging losses must be less than 100%.");
  }

  const homeFraction = homeShare / 100;
  const publicFraction = 1 - homeFraction;
  const lossFactor = 1 - loss / 100;

  const kmPerYear = kmPerWeek * 52;
  const energyAtBatteryKWhPerYear = (kmPerYear * consumption) / 100;
  const gridKWhPerYear = energyAtBatteryKWhPerYear / lossFactor;

  const weightedTariffAUD = homeFraction * homeRate + publicFraction * publicRate;

  if (publicRate < homeRate && publicFraction > 0) {
    warnings.push("You have public charging cheaper than home — double-check the tariffs.");
  }

  return {
    kmPerYear,
    energyAtBatteryKWhPerYear,
    gridKWhPerYear,
    weightedTariffAUD,
    annualCostMixed: gridKWhPerYear * weightedTariffAUD,
    annualCostHomeOnly: gridKWhPerYear * homeRate,
    annualCostPublicOnly: gridKWhPerYear * publicRate,
    warnings,
  };
}
