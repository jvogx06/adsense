import Link from "next/link";
import { getCostDatum } from "@/data/costs/index";
import { formatAUDRange, formatAUDPerUnitRange } from "@/lib/format";
import { SourceBadge, LastChecked } from "./sources";
import type { CostDatum } from "@/lib/validation/schemas";

function unitLabel(unit: CostDatum["unit"]): string | null {
  switch (unit) {
    case "AUD/hour":
      return "hour";
    case "AUD/m2":
      return "m²";
    case "AUD/kWh":
      return "kWh";
    default:
      return null;
  }
}

function formatValue(datum: CostDatum): string {
  const perUnit = unitLabel(datum.unit);
  if (perUnit) {
    return formatAUDPerUnitRange(datum.low, datum.high, perUnit);
  }
  if (datum.unit === "percent") {
    const parts = [datum.low, datum.high].filter((v) => v !== undefined);
    return parts.map((v) => `${v}%`).join("–");
  }
  return formatAUDRange(datum.low, datum.high);
}

/**
 * Renders a cost datum with full traceability (spec §5.2/§11): value, scope,
 * what it includes/excludes, source badge and last-checked date. Low/typical/
 * high semantics are shown only when the dataset actually contains them.
 */
export function CostRangeCard({ datumId }: { datumId: string }) {
  const datum = getCostDatum(datumId);
  if (!datum) {
    // Missing data is a hard error in production builds (spec §64).
    if (process.env.NODE_ENV === "production") {
      throw new Error(`CostRangeCard: unknown cost datum "${datumId}"`);
    }
    return null;
  }

  const representationLabel =
    datum.representation === "range"
      ? "Range"
      : datum.representation === "average"
        ? "Average"
        : datum.representation === "program-rule"
          ? "Program rule"
          : "Example";

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{datum.metric}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-text">
            {formatValue(datum)}
          </p>
        </div>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
          {representationLabel}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted">{datum.scope}</p>

      {(datum.includes.length > 0 || datum.excludes.length > 0) && (
        <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
          {datum.includes.length > 0 && (
            <div>
              <dt className="font-semibold text-text">Includes</dt>
              <dd className="text-muted">{datum.includes.join("; ")}</dd>
            </div>
          )}
          {datum.excludes.length > 0 && (
            <div>
              <dt className="font-semibold text-text">Excludes / unclear</dt>
              <dd className="text-muted">{datum.excludes.join("; ")}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
        <SourceBadge sourceId={datum.sourceId} />
        <LastChecked date={datum.checkedAt} label="Data checked" />
        <Link href="/methodology" className="text-xs text-info hover:underline">
          How we use sources
        </Link>
      </div>
    </div>
  );
}
