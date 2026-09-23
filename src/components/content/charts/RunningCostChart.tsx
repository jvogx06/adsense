import { acTariffCostSeries, AC_TARIFF_EXAMPLE } from "@/lib/calculators/examples";
import { formatAUD, formatKWh } from "@/lib/format";
import { ChartFrame } from "./ChartFrame";

/**
 * Air-conditioner running cost across three electricity tariffs, for one
 * clearly-defined example (spec §5B). Values are derived from the tested
 * running-cost formula and shown as text beside each bar. Tariffs are labelled
 * example points, not a claimed national rate — the user's own tariff drives
 * the real number in the calculator.
 */
export function RunningCostChart() {
  const series = acTariffCostSeries();
  if (series.length === 0) return null;
  const axisMax = Math.max(...series.map((p) => p.costPerDay));
  const example = series[0]!;

  return (
    <ChartFrame
      title="Running cost by electricity tariff"
      kind="example"
      intro={`Example: a ${AC_TARIFF_EXAMPLE.ratedInputKW.toFixed(1)} kW-input unit running ${AC_TARIFF_EXAMPLE.hoursPerDay} hours/day uses about ${formatKWh(example.kWhPerDay)}/day. Cost per day at three tariffs:`}
      footnote="Illustrative tariff points only — enter your own unit power, hours and tariff in the calculator for a figure that fits your home."
    >
      <div className="flex flex-col gap-3">
        {series.map((p) => {
          const width = Math.max((p.costPerDay / axisMax) * 100, 2);
          return (
            <div key={p.tariffCents}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-text tabular-nums">
                  {p.tariffCents} c/kWh
                </span>
                <span className="text-sm font-semibold tabular-nums text-primary-dark">
                  {formatAUD(p.costPerDay, { forceDecimals: true })}/day
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-primary/5"
              >
                <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </ChartFrame>
  );
}
