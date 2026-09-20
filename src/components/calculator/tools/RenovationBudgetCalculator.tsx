"use client";

import { useState } from "react";
import {
  renovationBudget,
  type RenovationBudgetResult,
} from "@/lib/calculators/renovation-budget";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { formatAUD } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField, ResultStat } from "../fields";
import { CalcFrame } from "../CalcFrame";

const CALC_ID = "home-renovation-budget";

interface Line {
  label: string;
  low: string;
  base: string;
  high: string;
}

/** Optional preset (e.g. bathroom) — labels only, no fabricated prices. */
const PRESETS: Record<string, Line[]> = {
  bathroom: [
    { label: "Demolition & prep", low: "", base: "", high: "" },
    { label: "Waterproofing", low: "", base: "", high: "" },
    { label: "Tiling", low: "", base: "", high: "" },
    { label: "Fixtures & tapware", low: "", base: "", high: "" },
    { label: "Plumbing & electrical", low: "", base: "", high: "" },
    { label: "Cabinetry", low: "", base: "", high: "" },
    { label: "Labour", low: "", base: "", high: "" },
  ],
};

export function RenovationBudgetCalculator({ preset }: { preset?: keyof typeof PRESETS }) {
  const [lines, setLines] = useState<Line[]>(
    preset && PRESETS[preset]
      ? PRESETS[preset]!
      : [
          { label: "Item 1", low: "", base: "", high: "" },
          { label: "Item 2", low: "", base: "", high: "" },
        ],
  );
  const [contingency, setContingency] = useState("10");
  const [fees, setFees] = useState("0");
  const [permits, setPermits] = useState("0");
  const [temp, setTemp] = useState("0");
  const [result, setResult] = useState<RenovationBudgetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(i: number, key: keyof Line, value: string) {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, [key]: value } : l)));
  }
  function addLine() {
    setLines((prev) => [...prev, { label: `Item ${prev.length + 1}`, low: "", base: "", high: "" }]);
  }
  function removeLine(i: number) {
    setLines((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  function calculate() {
    try {
      const res = renovationBudget({
        lineItems: lines.map((l) => ({
          label: l.label,
          low: parseLooseNumber(l.low || "0"),
          base: parseLooseNumber(l.base || "0"),
          high: parseLooseNumber(l.high || "0"),
        })),
        contingencyPercent: parseLooseNumber(contingency),
        professionalFees: parseLooseNumber(fees || "0"),
        permits: parseLooseNumber(permits || "0"),
        temporaryAccommodation: parseLooseNumber(temp || "0"),
      });
      setResult(res);
      setError(null);
      analytics.calculatorCompleted(CALC_ID);
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
      <p className="text-sm text-muted">
        This is a budgeting worksheet — enter your own low/base/high figures for
        each line. It does not fill in market prices for you.
      </p>
      <div className="flex flex-col gap-3">
        {lines.map((line, i) => (
          <fieldset key={i} className="rounded-md border border-border p-3">
            <legend className="px-1 text-xs font-medium text-muted">Line {i + 1}</legend>
            <label className="mb-2 flex flex-col gap-1 text-sm font-medium">
              Label
              <input
                value={line.label}
                onChange={(e) => update(i, "label", e.target.value)}
                className="min-h-11 rounded-md border border-border px-3 py-2 text-base"
              />
            </label>
            <div className="grid grid-cols-3 gap-2">
              <NumberField label="Low" unit="A$" value={line.low} onChange={(v) => update(i, "low", v)} min={0} />
              <NumberField label="Base" unit="A$" value={line.base} onChange={(v) => update(i, "base", v)} min={0} />
              <NumberField label="High" unit="A$" value={line.high} onChange={(v) => update(i, "high", v)} min={0} />
            </div>
            {lines.length > 1 && (
              <button type="button" onClick={() => removeLine(i)} className="mt-2 text-xs font-medium text-danger hover:underline">
                Remove line
              </button>
            )}
          </fieldset>
        ))}
        <button type="button" onClick={addLine} className="self-start rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:border-primary">
          + Add line item
        </button>
      </div>
      <NumberField label="Contingency" unit="%" value={contingency} onChange={setContingency} hint="0–50%." min={0} max={50} />
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Professional fees" unit="A$" value={fees} onChange={setFees} min={0} />
        <NumberField label="Permits" unit="A$" value={permits} onChange={setPermits} min={0} />
        <NumberField label="Temp. accommodation" unit="A$" value={temp} onChange={setTemp} min={0} />
      </div>
    </>
  );

  const results = result && (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        Your budget lands between <strong>{formatAUD(result.totalLow)}</strong> and{" "}
        <strong>{formatAUD(result.totalHigh)}</strong>, with a base case of{" "}
        <strong>{formatAUD(result.totalBase)}</strong>.
      </p>
      <div className="grid grid-cols-3 gap-3">
        <ResultStat label="Low" value={formatAUD(result.totalLow)} />
        <ResultStat label="Base" value={formatAUD(result.totalBase)} emphasis />
        <ResultStat label="High" value={formatAUD(result.totalHigh)} />
      </div>
      <p className="text-sm text-muted">
        Includes {formatAUD(result.fixedExtras)} fixed extras and a contingency of{" "}
        {formatAUD(result.contingencyBase)} on the base case.
      </p>
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={error} results={results} />
  );
}
