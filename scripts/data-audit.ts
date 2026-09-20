/**
 * Data freshness audit (spec §22 / §60).
 *
 * Lists cost data and program records whose "last checked" date is older than the
 * review cadence for their category. Informational by default (exit 0); it exits
 * non-zero only if a program dataset has actually expired (effectiveTo < today),
 * which must never ship as "current".
 */
import { costData } from "@/data/costs/index";
import { batteryProgram } from "@/data/programs/battery-program";
import { daysSince } from "@/lib/format";

const CADENCE_DAYS: Record<string, number> = {
  "solar-batteries": 90, // quarterly
  trades: 180,
  renovations: 180,
  energy: 365,
};

function cadenceFor(category: string): number {
  return CADENCE_DAYS[category] ?? 365;
}

let stale = 0;
console.log("Data freshness audit\n====================");

for (const datum of costData) {
  const age = daysSince(datum.checkedAt);
  const limit = cadenceFor(datum.category);
  if (age > limit) {
    stale++;
    console.log(`  [STALE ${age}d > ${limit}d] ${datum.id} (${datum.category}) — checked ${datum.checkedAt}`);
  }
}

// Battery program: monthly cadence + expiry check.
const programAge = daysSince(batteryProgram.checkedAt);
if (programAge > 30) {
  stale++;
  console.log(`  [STALE ${programAge}d > 30d] program:${batteryProgram.id} — checked ${batteryProgram.checkedAt}`);
}

let expired = false;
if (batteryProgram.effectiveTo) {
  const today = new Date().toISOString().slice(0, 10);
  if (batteryProgram.effectiveTo < today) {
    expired = true;
    console.log(`  [EXPIRED] program:${batteryProgram.id} ended ${batteryProgram.effectiveTo} but is still presented as current`);
  }
}

console.log(
  `\n${stale === 0 ? "All records within cadence." : `${stale} record(s) due for review.`}`,
);

if (expired) {
  console.error("\nFAIL: an active program dataset has expired. Update or retire it.");
  process.exit(1);
}
process.exit(0);
