import { getCostDatum } from "@/data/costs/index";
import { formatAUD } from "@/lib/format";
import { ChartFrame, type ChartKind } from "./ChartFrame";
import type { CostDatum } from "@/lib/validation/schemas";

/**
 * Horizontal source-backed range bars (spec §5A/§5D). Reads figures straight
 * from the cost registry — no numbers are passed in or invented here. Each row
 * shows its value as text beside the bar, so the data never depends on seeing
 * the chart. All rows must share a unit so the shared axis is honest.
 */
function unitSuffix(unit: CostDatum["unit"]): string {
  switch (unit) {
    case "AUD/hour":
      return "/hour";
    case "AUD/m2":
      return "/m²";
    case "AUD/kWh":
      return "/kWh";
    default:
      return "";
  }
}

function valueText(d: CostDatum): string {
  const suffix = unitSuffix(d.unit);
  const money = (v: number) => `${formatAUD(v)}${suffix}`;
  if (d.low !== undefined && d.high !== undefined) return `${money(d.low)} – ${money(d.high)}`;
  if (d.low !== undefined) return `from ${money(d.low)}`;
  if (d.high !== undefined) return `up to ${money(d.high)}`;
  return "—";
}

export function CostRangeChart({
  title,
  datumIds,
  kind = "range",
  intro,
  labelFor,
  footnote,
}: {
  title: string;
  datumIds: string[];
  kind?: ChartKind;
  intro?: string;
  /** Optional short label override per datum id (defaults to the datum metric). */
  labelFor?: (d: CostDatum) => string;
  footnote?: string;
}) {
  const rows = datumIds
    .map((id) => getCostDatum(id))
    .filter((d): d is CostDatum => Boolean(d));

  if (rows.length === 0) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`CostRangeChart: no known cost datums in [${datumIds.join(", ")}]`);
    }
    return null;
  }

  // Shared axis: the largest defined figure across the rows.
  const axisMax = Math.max(
    ...rows.flatMap((d) => [d.low ?? 0, d.high ?? 0]),
  );
  const openEnded = rows.some((d) => d.high === undefined && d.low !== undefined);

  // Cite every distinct source represented in the bars (a cross-trade
  // comparison legitimately spans more than one source).
  const sourceIds = [...new Set(rows.map((d) => d.sourceId))];
  const checkedAt = rows.map((d) => d.checkedAt).sort().at(-1);

  return (
    <ChartFrame
      title={title}
      kind={kind}
      sourceIds={sourceIds}
      checkedAt={checkedAt}
      intro={intro}
      footnote={
        footnote ??
        (openEnded ? "Bars marked “from” are open-ended in the source — no upper bound is published." : undefined)
      }
    >
      <div className="flex flex-col gap-3">
        {rows.map((d) => {
          const label = labelFor ? labelFor(d) : d.metric;
          const start = ((d.low ?? 0) / axisMax) * 100;
          const end = ((d.high ?? axisMax) / axisMax) * 100;
          const width = Math.max(end - start, 1.5);
          return (
            <div key={d.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-text">{label}</span>
                <span className="text-sm font-semibold tabular-nums text-primary-dark">
                  {valueText(d)}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-primary/5"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ marginInlineStart: `${start}%`, width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartFrame>
  );
}
