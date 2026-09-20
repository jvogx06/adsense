"use client";

import { useMemo, useState } from "react";
import { roofReplacementRange, type RoofReplacementResult } from "@/lib/calculators/roof-replacement";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { costData } from "@/data/costs/index";
import { formatAUD, formatAUDPerUnitRange, formatDate } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField, SelectField, ResultStat } from "../fields";
import { CalcFrame } from "../CalcFrame";

const CALC_ID = "roof-replacement-range";

/** Material options come from dated source datums — never blended (spec §12). */
const materials = costData.filter((d) => d.id.startsWith("roof-replace-"));

export function RoofReplacementCalculator() {
  const [area, setArea] = useState("150");
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? "");
  const [result, setResult] = useState<RoofReplacementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const material = useMemo(
    () => materials.find((m) => m.id === materialId),
    [materialId],
  );

  function calculate() {
    try {
      if (!material || material.low === undefined || material.high === undefined) {
        throw new CalculatorError("Select a roofing material.");
      }
      const res = roofReplacementRange({
        areaM2: parseLooseNumber(area),
        lowPerM2: material.low,
        highPerM2: material.high,
      });
      setResult(res);
      setError(null);
      analytics.calculatorCompleted(CALC_ID, material.id);
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
      <NumberField label="Roof area" unit="m²" value={area} onChange={setArea} example="150" min={0} />
      <SelectField
        label="Roofing material"
        value={materialId}
        onChange={setMaterialId}
        options={materials.map((m) => ({ value: m.id, label: m.metric.replace("Roof replacement — ", "") }))}
      />
      {material && (
        <p className="text-xs text-muted">
          Using {formatAUDPerUnitRange(material.low, material.high, "m²")} —{" "}
          {material.scope} (source dated {material.sourceDate ?? "n/a"}, checked{" "}
          {formatDate(material.checkedAt)}).
        </p>
      )}
    </>
  );

  const results = result && material && (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        At {formatAUDPerUnitRange(material.low, material.high, "m²")}, a {area} m² roof
        would fall roughly between <strong>{formatAUD(result.low)}</strong> and{" "}
        <strong>{formatAUD(result.high)}</strong>.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ResultStat label="Low" value={formatAUD(result.low)} />
        <ResultStat label="High" value={formatAUD(result.high)} emphasis />
      </div>
      <p className="text-xs text-muted">
        Reference midpoint {formatAUD(result.referenceMidpoint)} is arithmetic only,
        not an observed average. Confirm whether a quote is material-only or installed,
        and never mix replacement with restoration or repair ranges.
      </p>
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={error} results={results} />
  );
}
