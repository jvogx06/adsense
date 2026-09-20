import { CalculatorError, assertNonNegative, centsToAUD } from "./shared";

export interface ApplianceRow {
  label: string;
  /** Power draw in watts. */
  watts: number;
  quantity: number;
  hoursPerDay: number;
  /** Active days per week (default 7). */
  daysPerWeek?: number;
}

export interface ApplianceResult {
  label: string;
  kWhPerDay: number;
  kWhPerYear: number;
  costPerDay: number;
  costPerYear: number;
}

export interface ElectricityUsageResult {
  rows: ApplianceResult[];
  totalKWhPerDay: number;
  totalKWhPerYear: number;
  totalCostPerDay: number;
  totalCostPerYear: number;
  totalCostPerMonthEquivalent: number;
}

/**
 * Electricity usage across one or more appliances (spec §12).
 * kWh/day = watts/1000 × quantity × hours. Annual = daily energy × active days.
 */
export function electricityUsage(
  rows: ApplianceRow[],
  tariffCents: number,
): ElectricityUsageResult {
  const tariffAUD = centsToAUD(
    assertNonNegative(tariffCents, "electricity tariff (c/kWh)"),
  );

  const results: ApplianceResult[] = rows.map((row, i) => {
    const label = row.label?.trim() || `Appliance ${i + 1}`;
    const watts = assertNonNegative(row.watts, `${label} power (W)`);
    const quantity = assertNonNegative(row.quantity, `${label} quantity`);
    const hoursPerDay = assertNonNegative(row.hoursPerDay, `${label} hours/day`);
    if (hoursPerDay > 24) {
      throw new CalculatorError(`${label}: hours per day cannot be more than 24.`);
    }
    const daysPerWeek = assertNonNegative(row.daysPerWeek ?? 7, `${label} days/week`);
    if (daysPerWeek > 7) {
      throw new CalculatorError(`${label}: days per week cannot be more than 7.`);
    }

    const kWhPerDay = (watts / 1000) * quantity * hoursPerDay;
    const activeDaysPerYear = daysPerWeek * 52;
    const kWhPerYear = kWhPerDay * activeDaysPerYear;

    return {
      label,
      kWhPerDay,
      kWhPerYear,
      costPerDay: kWhPerDay * tariffAUD,
      costPerYear: kWhPerYear * tariffAUD,
    };
  });

  const totalKWhPerDay = results.reduce((s, r) => s + r.kWhPerDay, 0);
  const totalKWhPerYear = results.reduce((s, r) => s + r.kWhPerYear, 0);
  const totalCostPerDay = results.reduce((s, r) => s + r.costPerDay, 0);
  const totalCostPerYear = results.reduce((s, r) => s + r.costPerYear, 0);

  return {
    rows: results,
    totalKWhPerDay,
    totalKWhPerYear,
    totalCostPerDay,
    totalCostPerYear,
    totalCostPerMonthEquivalent: totalCostPerYear / 12,
  };
}
