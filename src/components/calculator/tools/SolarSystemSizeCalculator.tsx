"use client";

import { useState } from "react";
import { solarSystemSize, type SolarSystemSizeResult } from "@/lib/calculators/solar-system-size";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { formatNumber, formatKWh } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField, ResultStat } from "../fields";
import { CalcFrame, Warnings } from "../CalcFrame";

const CALC_ID = "solar-system-size";

export function SolarSystemSizeCalculator() {
  const [dailyUse, setDailyUse] = useState("20");
  const [offset, setOffset] = useState("80");
  const [peakSun, setPeakSun] = useState("");
  const [loss, setLoss] = useState("15");
  const [result, setResult] = useState<SolarSystemSizeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calculate() {
    try {
      const res = solarSystemSize({
        dailyUseKWh: parseLooseNumber(dailyUse),
        offsetPercent: parseLooseNumber(offset),
        peakSunHours: parseLooseNumber(peakSun),
        lossPercent: parseLooseNumber(loss),
      });
      setResult(res);
      setError(null);
      analytics.calculatorCompleted(CALC_ID);
    } catch (e) {
      setError(e instanceof CalculatorError ? e.message : "Please enter your peak-sun-hours and other values.");
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
      <NumberField label="Daily electricity use" unit="kWh/day" value={dailyUse} onChange={setDailyUse} example="20" min={0} />
      <NumberField label="Desired offset" unit="%" value={offset} onChange={setOffset} hint="Share of daily use to cover." example="80" min={0} />
      <NumberField
        label="Peak-sun-hours"
        value={peakSun}
        onChange={setPeakSun}
        hint="Enter a value for your own location — we do not assume one."
        example="4.2"
        min={0}
      />
      <NumberField label="System losses" unit="%" value={loss} onChange={setLoss} hint="Inverter, wiring, soiling, temperature." example="15" min={0} max={99} />
    </>
  );

  const results = result && (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        To cover that target you would need roughly a{" "}
        <strong>{formatNumber(result.requiredDcKW, 1)} kW</strong> solar system (DC),
        generating about <strong>{formatKWh(result.targetDailyGenerationKWh)}</strong> a day.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ResultStat label="Required system (DC)" value={`${formatNumber(result.requiredDcKW, 1)} kW`} emphasis />
        <ResultStat label="Target generation" value={`${formatNumber(result.targetDailyGenerationKWh, 1)} kWh/day`} />
      </div>
      <Warnings warnings={result.warnings} />
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={error} results={results} />
  );
}
