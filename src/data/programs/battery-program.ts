import {
  assertValid,
  batteryProgramSchema,
  type BatteryProgram,
} from "@/lib/validation/schemas";
import { requireSource } from "@/data/sources/registry";

/**
 * Federal Cheaper Home Batteries Program dataset (P0 §2).
 *
 * The estimator is STC-based, not a flat "quote × 30%". All program settings —
 * the dated STC factor schedule (which declines to 2030) and the capacity taper
 * — live here, never hard-coded in UI. The "around 30%" figure is retained only
 * as the Government's approximate program TARGET for explanatory context.
 */
const program: BatteryProgram = {
  id: "cheaper-home-batteries",
  name: "Cheaper Home Batteries Program",
  checkedAt: "2026-09-20",
  effectiveFrom: "2026-05-01",
  approxProgramTargetPercent: 30,

  // Install eligibility window; STC support is bounded by stcSupportMaxKWh.
  eligibilityMinKWh: 5,
  eligibilityMaxKWh: 100,
  stcSupportMaxKWh: 50,

  // Capacity taper: fraction of the STC factor applied to capacity in each band.
  capacityTaper: [
    { fromKWh: 0, toKWh: 14, factorFraction: 1.0 },
    { fromKWh: 14, toKWh: 28, factorFraction: 0.6 },
    { fromKWh: 28, toKWh: 50, factorFraction: 0.15 },
  ],

  // Dated STC multiplier schedule (declines over time until 2030).
  stcFactorSchedule: [
    { label: "May–Dec 2026", from: "2026-05-01", to: "2026-12-31", factor: 6.8 },
    { label: "Jan–Jun 2027", from: "2027-01-01", to: "2027-06-30", factor: 5.7 },
    { label: "Jul–Dec 2027", from: "2027-07-01", to: "2027-12-31", factor: 5.2 },
    { label: "Jan–Jun 2028", from: "2028-01-01", to: "2028-06-30", factor: 4.6 },
    { label: "Jul–Dec 2028", from: "2028-07-01", to: "2028-12-31", factor: 4.1 },
    { label: "Jan–Jun 2029", from: "2029-01-01", to: "2029-06-30", factor: 3.6 },
    { label: "Jul–Dec 2029", from: "2029-07-01", to: "2029-12-31", factor: 3.1 },
    { label: "Jan–Jun 2030", from: "2030-01-01", to: "2030-06-30", factor: 2.6 },
    { label: "Jul–Dec 2030", from: "2030-07-01", to: "2030-12-31", factor: 2.1 },
  ],

  capacityEligibilityNote:
    "Eligible battery installations are nominally 5–100 kWh, but STC support is calculated on usable capacity up to 50 kWh using the capacity taper. STC support must follow the current official program rules.",

  sourceIds: ["dcceew-battery-program", "cer-q2-2026", "rec-registry-stc-calculator"],
  officialUrl: "https://www.dcceew.gov.au/energy/programs/cheaper-home-batteries",
  recRegistryUrl:
    "https://www.rec-registry.gov.au/rec-registry/app/calculators/systemcalc",

  notes: [
    "This is an unofficial estimate. Confirm your actual STC entitlement using the REC Registry calculator and your accredited installer.",
    "STC support declines over time until 2030; the factor depends on your installation date.",
    "The '~30%' figure is the Government's approximate program target, not the calculator formula.",
    "The dollar value of STCs depends on the certificate market and your installer's arrangement.",
  ],
  history: [
    {
      date: "2026-05-01",
      change:
        "Program settings took effect: STC factor 6.8 for May–Dec 2026, with a capacity taper (100% to 14 kWh, 60% to 28 kWh, 15% to 50 kWh).",
    },
    {
      date: "2026-09-20",
      change: "Source pages re-checked; no rule change recorded on this check.",
    },
  ],
};

assertValid(batteryProgramSchema, program, "battery program dataset");
for (const id of program.sourceIds) requireSource(id);

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
