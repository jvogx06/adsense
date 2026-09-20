"use client";

import { useMemo, useState } from "react";
import { roofReplacementRange, type RoofReplacementResult } from "@/lib/calculators/roof-replacement";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { costData } from "@/data/costs/index";
import { formatAUD, formatAUDPerUnitRange, formatDate } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField, SelectField, ResultStat } from "../fields";
import { CalcFrame } from "../CalcFrame";

const CALC_ID = "roof-restoration-range";

// Source category bands — the source does NOT define area thresholds, so the
// user picks the band that matches their quote/source context (P1 §11).
const bands = costData.filter((d) => d.id.startsWith("roof-restoration-"));

export function RoofRestorationCalculator() {
  const [area, setArea] = useState("150");
  const [bandId, setBandId] = useState(bands[0]?.id ?? "");
  const [result, setResult] = useState<RoofReplacementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const band = useMemo(() => bands.find((b) => b.id === bandId), [bandId]);

  function calculate() {
    try {
      if (!band || band.low === undefined || band.high === undefined) {
        throw new CalculatorError("Select a roof-size category.");
      }
      const res = roofReplacementRange({
        areaM2: parseLooseNumber(area),
        lowPerM2: band.low,
        highPerM2: band.high,
      });
      setResult(res);
      setError(null);
      analytics.calculatorCompleted(CALC_ID, band.id);
    } catch (e) {
      setError(e instanceof CalculatorError ? e.message : "Please check your inputs.");
      setResult(null);
    }
  }
  function reset() {
    setResult(null);
    setError(null);
    analytics.calculatorReset(CALC_ID);
  }

  const form = (
    <>
      <div className="rounded-md border border-info/30 bg-info/5 p-3 text-sm">
        The cited source does not define area thresholds for &ldquo;small&rdquo;,
        &ldquo;medium&rdquo; and &ldquo;larger&rdquo;. Select the category that matches your
        quote or source context rather than treating this as an automatic classification.
      </div>
      <NumberField label="Roof area" unit="m²" value={area} onChange={setArea} example="150" min={0} />
      <SelectField
        label="Roof-size category (from the source)"
        value={bandId}
        onChange={setBandId}
        options={bands.map((b) => ({
          value: b.id,
          label: `${b.metric.replace("Roof restoration — ", "")} (${formatAUDPerUnitRange(b.low, b.high, "m²")})`,
        }))}
      />
      {band && (
        <p className="text-xs text-muted">
          Using {formatAUDPerUnitRange(band.low, band.high, "m²")} — source dated{" "}
          {band.sourceDate ?? "n/a"}, checked {formatDate(band.checkedAt)}.
        </p>
      )}
    </>
  );

  const results = result && band && (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        At {formatAUDPerUnitRange(band.low, band.high, "m²")}, a {area} m² roof in the selected
        category would fall roughly between <strong>{formatAUD(result.low)}</strong> and{" "}
        <strong>{formatAUD(result.high)}</strong>.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ResultStat label="Low" value={formatAUD(result.low)} />
        <ResultStat label="High" value={formatAUD(result.high)} emphasis />
      </div>
      <p className="text-xs text-muted">
        This is a source-based range for restoration, not a quote and not a replacement cost.
      </p>
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={error} results={results} />
  );
}
