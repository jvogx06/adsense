"use client";

import { useState } from "react";
import {
  batteryDiscountEstimate,
  type BatteryDiscountResult,
} from "@/lib/calculators/battery-discount";
import { batteryProgram } from "@/data/programs/battery-program";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { formatAUD, formatDate, formatPercent } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField, SelectField, ResultStat } from "../fields";
import { CalcFrame, Warnings } from "../CalcFrame";

const CALC_ID = "battery-discount-estimator";

export function BatteryDiscountCalculator() {
  const [capacity, setCapacity] = useState("10");
  const [quote, setQuote] = useState("12000");
  const [mode, setMode] = useState<"indicative" | "manual">("indicative");
  const [manualDiscount, setManualDiscount] = useState("");
  const [result, setResult] = useState<BatteryDiscountResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calculate() {
    try {
      const res = batteryDiscountEstimate(
        {
          usableCapacityKWh: parseLooseNumber(capacity),
          eligibleInstalledQuote: parseLooseNumber(quote),
          mode,
          manualDiscountAmount: mode === "manual" ? parseLooseNumber(manualDiscount) : undefined,
        },
        batteryProgram,
      );
      setResult(res);
      setError(null);
      analytics.calculatorCompleted(CALC_ID, mode);
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
      <div className="rounded-md border border-energy/40 bg-energy/5 p-3 text-sm">
        <strong className="text-text">Not an official government calculator.</strong>{" "}
        This gives a rough, dated indicative figure only. Confirm your real
        entitlement with DCCEEW and your installer.
      </div>
      <NumberField label="Usable battery capacity" unit="kWh" value={capacity} onChange={setCapacity} example="10" min={0} />
      <NumberField label="Eligible installed quote" unit="A$" value={quote} onChange={setQuote} example="12000" min={0} />
      <SelectField
        label="Mode"
        value={mode}
        onChange={(v) => setMode(v as "indicative" | "manual")}
        options={[
          { value: "indicative", label: "Indicative (apply dated program %)" },
          { value: "manual", label: "Manual (I know my discount amount)" },
        ]}
      />
      {mode === "manual" && (
        <NumberField label="Quoted discount amount" unit="A$" value={manualDiscount} onChange={setManualDiscount} min={0} />
      )}
    </>
  );

  const results = result && (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        {result.isIndicative ? "Rough indicative discount" : "Your quoted discount"} of about{" "}
        <strong>{formatAUD(result.discountAmount)}</strong> ({formatPercent(result.percentApplied)}),
        leaving roughly <strong>{formatAUD(result.netCostAfterDiscount)}</strong>.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ResultStat label="Estimated discount" value={formatAUD(result.discountAmount)} />
        <ResultStat label="Net cost after discount" value={formatAUD(result.netCostAfterDiscount)} emphasis />
      </div>
      <p className="text-xs text-muted">
        {result.programName} · effective from {formatDate(result.effectiveFrom)} · source
        checked {formatDate(result.checkedAt)} ·{" "}
        <a href={result.officialUrl} target="_blank" rel="noopener noreferrer" className="underline">
          official program
        </a>
      </p>
      <Warnings warnings={result.warnings} />
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={error} results={results} />
  );
}
