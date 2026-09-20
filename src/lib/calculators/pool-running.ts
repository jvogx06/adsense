import {
  assertNonNegative,
  assertPositive,
  centsToAUD,
} from "./shared";

export interface PoolRunningInput {
  pumpKW: number;
  pumpHoursPerDay: number;
  pumpDaysPerYear: number;
  tariffCents: number;
  /** Optional heater: thermal output kW and COP (heat pump) or efficiency. */
  heaterThermalKW?: number;
  heaterCOP?: number;
  heaterHoursPerDay?: number;
  heaterDaysPerYear?: number;
}

export interface PoolRunningResult {
  pumpKWhPerYear: number;
  pumpCostPerYear: number;
  heaterKWhPerYear: number;
  heaterCostPerYear: number;
  totalKWhPerYear: number;
  totalCostPerYear: number;
  warnings: string[];
}

/**
 * Pool running cost (spec §12).
 * Pump cost = pump_kW × hours × days × tariff.
 * Heater input = thermal_kW / COP if a thermal output + COP are given.
 */
export function poolRunningCost(input: PoolRunningInput): PoolRunningResult {
  const warnings: string[] = [
    "Variable-speed pumps and seasonal schedules can materially change this result.",
  ];

  const pumpKW = assertNonNegative(input.pumpKW, "pump power (kW)");
  const pumpHours = assertNonNegative(input.pumpHoursPerDay, "pump hours/day");
  const pumpDays = assertNonNegative(input.pumpDaysPerYear, "pump days/year");
  const tariffAUD = centsToAUD(assertNonNegative(input.tariffCents, "electricity tariff (c/kWh)"));

  const pumpKWhPerYear = pumpKW * pumpHours * pumpDays;
  const pumpCostPerYear = pumpKWhPerYear * tariffAUD;

  let heaterKWhPerYear = 0;
  if (input.heaterThermalKW !== undefined && input.heaterThermalKW > 0) {
    const thermal = assertNonNegative(input.heaterThermalKW, "heater output (kW)");
    const cop = assertPositive(input.heaterCOP ?? 1, "heater COP");
    const heaterHours = assertNonNegative(input.heaterHoursPerDay ?? 0, "heater hours/day");
    const heaterDays = assertNonNegative(input.heaterDaysPerYear ?? 0, "heater days/year");
    const inputKW = thermal / cop;
    heaterKWhPerYear = inputKW * heaterHours * heaterDays;
  }
  const heaterCostPerYear = heaterKWhPerYear * tariffAUD;

  const totalKWhPerYear = pumpKWhPerYear + heaterKWhPerYear;

  return {
    pumpKWhPerYear,
    pumpCostPerYear,
    heaterKWhPerYear,
    heaterCostPerYear,
    totalKWhPerYear,
    totalCostPerYear: pumpCostPerYear + heaterCostPerYear,
    warnings,
  };
}
