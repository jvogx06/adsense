"use client";

import { useState } from "react";
import {
  batteryStcEstimate,
  type BatteryDiscountResult,
} from "@/lib/calculators/battery-discount";
import { batteryProgram } from "@/data/programs/battery-program";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { formatAUD, formatDate, formatNumber } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField, SelectField, ResultStat } from "../fields";
import { CalcFrame, Warnings } from "../CalcFrame";

const CALC_ID = "battery-discount-estimator";

export function BatteryDiscountCalculator() {
  const [capacity, setCapacity] = useState("10");
  const [periodFrom, setPeriodFrom] = useState(
    batteryProgram.stcFactorSchedule[0]!.from,
  );
  const [stcPrice, setStcPrice] = useState("");
  const [result, setResult] = useState<BatteryDiscountResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calculate() {
    try {
      const priceRaw = stcPrice.trim();
      const res = batteryStcEstimate(
        {
          usableCapacityKWh: parseLooseNumber(capacity),
          installDateISO: periodFrom,
          stcPrice: priceRaw === "" ? undefined : parseLooseNumber(priceRaw),
        },
        batteryProgram,
      );
      setResult(res);
      setError(null);
      analytics.calculatorCompleted(CALC_ID, priceRaw ? "with-price" : "stc-only");
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
        <strong className="text-text">Unofficial estimate.</strong> Confirm your actual
        STC entitlement using the{" "}
        <a href={batteryProgram.recRegistryUrl} target="_blank" rel="noopener noreferrer" className="underline">
          REC Registry calculator
        </a>{" "}
        and your accredited installer. This is not an official government calculator.
      </div>
      <NumberField
        label="Usable battery capacity"
        unit="kWh"
        value={capacity}
        onChange={setCapacity}
        hint="STC support is calculated on usable capacity up to 50 kWh."
        example="10"
        min={0}
      />
      <SelectField
        label="Installation period"
        value={periodFrom}
        onChange={setPeriodFrom}
        hint="The STC factor declines over time until 2030."
        options={batteryProgram.stcFactorSchedule.map((p) => ({
          value: p.from,
          label: `${p.label} — factor ${p.factor}`,
        }))}
      />
      <NumberField
        label="Certificate price (optional)"
        unit="A$/STC"
        value={stcPrice}
        onChange={setStcPrice}
        hint="Ask your installer, or leave blank to see the STC count only."
        example="38"
        min={0}
      />
    </>
  );

  const results = result && (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        At {result.factorLabel} (factor {result.factor}), an estimated{" "}
        <strong>{formatNumber(result.eligibleStcs, 0)} STCs</strong> for a{" "}
        {formatNumber(result.stcCapacityKWh, 1)} kWh eligible capacity.
        {result.estimatedSupport !== null ? (
          <>
            {" "}At {formatAUD(result.stcPriceUsed ?? 0)}/STC that is roughly{" "}
            <strong>{formatAUD(result.estimatedSupport)}</strong> of support.
          </>
        ) : (
          <> Enter a certificate price to estimate the dollar value.</>
        )}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ResultStat label="Estimated STCs" value={formatNumber(result.eligibleStcs, 0)} emphasis />
        <ResultStat
          label="Estimated support"
          value={result.estimatedSupport !== null ? formatAUD(result.estimatedSupport) : "Enter STC price"}
        />
      </div>
      <p className="text-xs text-muted">
        {result.programName} · effective from {formatDate(result.effectiveFrom)} · source
        checked {formatDate(result.checkedAt)} ·{" "}
        <a href={result.officialUrl} target="_blank" rel="noopener noreferrer" className="underline">
          official program
        </a>{" "}
        ·{" "}
        <a href={result.recRegistryUrl} target="_blank" rel="noopener noreferrer" className="underline">
          REC Registry
        </a>
      </p>
      <Warnings warnings={result.warnings} />
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={error} results={results} />
  );
}
