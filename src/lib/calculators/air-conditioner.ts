import {
  CalculatorError,
  assertNonNegative,
  assertPositive,
  centsToAUD,
} from "./shared";

export interface AirConditionerInput {
  /** Electrical input power in kW, if known from the label. */
  ratedInputKW?: number;
  /** Alternatively, cooling capacity in kW + an efficiency ratio (EER/COP). */
  coolingCapacityKW?: number;
  efficiencyRatio?: number;
  hoursPerDay: number;
  daysPerWeek: number;
  weeksPerYear: number;
  tariffCents: number;
  /** Optional standby energy per day in kWh. */
  standbyKWhPerDay?: number;
  /**
   * Optional load factor 0–1 (advanced). The compressor does not run at full
   * draw continuously; a load factor scales the effective energy use.
   */
  loadFactor?: number;
}

export interface AirConditionerResult {
  inputKW: number;
  kWhPerDay: number;
  kWhPerYear: number;
  costPerDay: number;
  costPerWeek: number;
  costPerMonthEquivalent: number;
  costPerYear: number;
  warnings: string[];
}

/**
 * Air conditioner running cost (spec §12 / §35).
 * energy = input_kW × runtime_hours (+ standby). Cost = kWh × tariff.
 * If only cooling capacity is known, input_kW = capacity / efficiency ratio.
 */
export function airConditionerRunningCost(
  input: AirConditionerInput,
): AirConditionerResult {
  const warnings: string[] = [];

  let inputKW: number;
  if (input.ratedInputKW !== undefined) {
    inputKW = assertNonNegative(input.ratedInputKW, "input power (kW)");
  } else if (
    input.coolingCapacityKW !== undefined &&
    input.efficiencyRatio !== undefined
  ) {
    const capacity = assertNonNegative(
      input.coolingCapacityKW,
      "cooling capacity (kW)",
    );
    const ratio = assertPositive(input.efficiencyRatio, "efficiency ratio (EER/COP)");
    inputKW = capacity / ratio;
  } else {
    throw new CalculatorError(
      "Enter either the input power in kW, or the cooling capacity plus an efficiency ratio.",
    );
  }

  const hoursPerDay = assertNonNegative(input.hoursPerDay, "hours per day");
  if (hoursPerDay > 24) {
    throw new CalculatorError("Hours per day cannot be more than 24.");
  }
  const daysPerWeek = assertNonNegative(input.daysPerWeek, "days per week");
  if (daysPerWeek > 7) {
    throw new CalculatorError("Days per week cannot be more than 7.");
  }
  const weeksPerYear = assertNonNegative(input.weeksPerYear, "weeks per year");
  if (weeksPerYear > 52) {
    throw new CalculatorError("Weeks per year cannot be more than 52.");
  }
  const tariffCents = assertNonNegative(input.tariffCents, "electricity tariff (c/kWh)");
  if (tariffCents > 200) {
    warnings.push(
      "That electricity tariff is unusually high — double-check the c/kWh value.",
    );
  }
  const standby = assertNonNegative(
    input.standbyKWhPerDay ?? 0,
    "standby energy (kWh/day)",
  );
  const loadFactor = input.loadFactor ?? 1;
  if (loadFactor <= 0 || loadFactor > 1) {
    throw new CalculatorError("Load factor must be between 0 and 1.");
  }
  if (loadFactor < 1) {
    warnings.push(
      "A load factor below 1 assumes the unit does not draw full power the whole time — an editable assumption, not a fact.",
    );
  }

  const tariffAUD = centsToAUD(tariffCents);
  const kWhPerDay = inputKW * hoursPerDay * loadFactor + standby;
  const activeDaysPerYear = daysPerWeek * weeksPerYear;
  const kWhPerYear = kWhPerDay * activeDaysPerYear;

  const costPerDay = kWhPerDay * tariffAUD;
  const costPerWeek = kWhPerDay * daysPerWeek * tariffAUD;
  const costPerYear = kWhPerYear * tariffAUD;
  const costPerMonthEquivalent = costPerYear / 12;

  return {
    inputKW,
    kWhPerDay,
    kWhPerYear,
    costPerDay,
    costPerWeek,
    costPerMonthEquivalent,
    costPerYear,
    warnings,
  };
}
