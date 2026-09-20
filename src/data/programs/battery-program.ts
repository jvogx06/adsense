import {
  assertValid,
  batteryProgramSchema,
  type BatteryProgram,
} from "@/lib/validation/schemas";
import { requireSource } from "@/data/sources/registry";

/**
 * Federal Cheaper Home Batteries Program dataset.
 *
 * The estimator NEVER hard-codes a permanent 30%. The indicative percentage
 * lives here, is dated, and is always shown as "around" / "indicative" beside
 * the effective date and official source link. Program rules and settings
 * change over time; keep this dataset current and log changes in `history`.
 */
const program: BatteryProgram = {
  id: "cheaper-home-batteries",
  name: "Cheaper Home Batteries Program",
  checkedAt: "2026-09-20",
  effectiveFrom: "2026-05-01",
  headlineSupport: "around 30% upfront discount for eligible systems",
  indicativeDiscountPercent: 30,
  capacityEligibilityMinKWh: 5,
  capacityEligibilityMaxKWh: 100,
  capacityEligibilityNote:
    "Nominal 5–100 kWh systems; STC-style rules apply to eligible usable capacity. The support level declines over time until 2030.",
  sourceIds: ["dcceew-battery-program", "cer-q2-2026"],
  officialUrl:
    "https://www.dcceew.gov.au/energy/programs/cheaper-home-batteries",
  notes: [
    "Do not present 30% as a guaranteed exact household discount.",
    "Revised program settings apply from 1 May 2026.",
    "The discount declines over time until 2030.",
    "This site is not an official government calculator; always confirm current rules with DCCEEW.",
  ],
  history: [
    {
      date: "2026-05-01",
      change:
        "Revised program settings took effect. Indicative headline support around 30% for eligible systems.",
    },
    {
      date: "2026-09-20",
      change: "Source pages re-checked; no rule change recorded on this check.",
    },
  ],
};

assertValid(batteryProgramSchema, program, "battery program dataset");
for (const id of program.sourceIds) {
  requireSource(id);
}

export const batteryProgram = program;

/** True when the program's effective window includes the given date. */
export function isProgramActive(program: BatteryProgram, on = new Date()): boolean {
  const from = new Date(`${program.effectiveFrom}T00:00:00Z`);
  if (on < from) return false;
  if (program.effectiveTo) {
    const to = new Date(`${program.effectiveTo}T23:59:59Z`);
    if (on > to) return false;
  }
  return true;
}
