import {
  airConditionerRunningCost,
  type AirConditionerInput,
} from "./air-conditioner";

/**
 * Worked examples are DERIVED from the real calculator formulas so a displayed
 * example can never diverge from calculator logic (P0 §1). Pages render these;
 * unit tests pin their expected outputs.
 */
export interface AcWorkedExample {
  label: string;
  input: AirConditionerInput;
}

export const acWorkedExamples: AcWorkedExample[] = [
  {
    label: "Small split system",
    input: {
      ratedInputKW: 0.7,
      hoursPerDay: 6,
      daysPerWeek: 7,
      weeksPerYear: 52,
      tariffCents: 30,
    },
  },
  {
    label: "Large ducted system",
    input: {
      ratedInputKW: 3.5,
      hoursPerDay: 8,
      daysPerWeek: 7,
      weeksPerYear: 52,
      tariffCents: 30,
    },
  },
];

export function computeAcExample(example: AcWorkedExample) {
  return airConditionerRunningCost(example.input);
}

/**
 * A clearly-defined AC running-cost example used by the RunningCostChart: a
 * fixed unit and runtime, priced across three tariffs. The number is DERIVED
 * from the tested formula (never hand-typed), so the chart cannot drift from
 * calculator logic. Tariffs are illustrative points, not a claimed market rate.
 */
export const AC_TARIFF_EXAMPLE = {
  ratedInputKW: 1.0,
  hoursPerDay: 8,
  tariffPointsCents: [25, 35, 45] as const,
};

export interface AcTariffPoint {
  tariffCents: number;
  kWhPerDay: number;
  costPerDay: number;
}

export function acTariffCostSeries(): AcTariffPoint[] {
  return AC_TARIFF_EXAMPLE.tariffPointsCents.map((tariffCents) => {
    const r = airConditionerRunningCost({
      ratedInputKW: AC_TARIFF_EXAMPLE.ratedInputKW,
      hoursPerDay: AC_TARIFF_EXAMPLE.hoursPerDay,
      daysPerWeek: 7,
      weeksPerYear: 52,
      tariffCents,
    });
    return { tariffCents, kWhPerDay: r.kWhPerDay, costPerDay: r.costPerDay };
  });
}

/**
 * Reverse-cycle examples (heating + cooling) — same tested formula. Weeks/year
 * are labelled seasonal assumptions, not market claims.
 */
export const reverseCycleExamples: AcWorkedExample[] = [
  {
    label: "Reverse-cycle heating, medium room",
    input: {
      ratedInputKW: 1.5,
      hoursPerDay: 6,
      daysPerWeek: 7,
      weeksPerYear: 13,
      tariffCents: 30,
    },
  },
  {
    label: "Reverse-cycle cooling, medium room",
    input: {
      ratedInputKW: 1.2,
      hoursPerDay: 6,
      daysPerWeek: 7,
      weeksPerYear: 13,
      tariffCents: 30,
    },
  },
];
