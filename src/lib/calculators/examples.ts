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
