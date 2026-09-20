"use client";

import { useState } from "react";
import {
  solarBatteryPayback,
  type SolarBatteryPaybackResult,
} from "@/lib/calculators/solar-battery-payback";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { formatAUD } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField, ResultStat } from "../fields";
import { CalcFrame, Warnings } from "../CalcFrame";

const CALC_ID = "solar-battery-payback";

export function SolarBatteryPaybackCalculator() {
  const [installedCost, setInstalledCost] = useState("9000");
  const [usableKWh, setUsableKWh] = useState("10");
  const [efficiency, setEfficiency] = useState("90");
  const [surplus, setSurplus] = useState("15");
  const [overnight, setOvernight] = useState("8");
  const [importTariff, setImportTariff] = useState("35");
  const [feedIn, setFeedIn] = useState("5");
  const [degradation, setDegradation] = useState("2");
  const [vpp, setVpp] = useState("0");
  const [horizon, setHorizon] = useState("15");
  const [result, setResult] = useState<SolarBatteryPaybackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calculate() {
    try {
      const res = solarBatteryPayback({
        netInstalledCost: parseLooseNumber(installedCost),
        usableKWh: parseLooseNumber(usableKWh),
        roundTripEfficiencyPercent: parseLooseNumber(efficiency),
        solarSurplusKWhPerDay: parseLooseNumber(surplus),
        overnightLoadKWhPerDay: parseLooseNumber(overnight),
        importTariffCents: parseLooseNumber(importTariff),
        feedInTariffCents: parseLooseNumber(feedIn),
        annualDegradationPercent: parseLooseNumber(degradation),
        vppBenefitPerYear: parseLooseNumber(vpp),
        horizonYears: parseLooseNumber(horizon),
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
      <NumberField label="Net installed cost" unit="A$" value={installedCost} onChange={setInstalledCost} hint="After any rebate you expect." example="9000" min={0} />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Usable capacity" unit="kWh" value={usableKWh} onChange={setUsableKWh} example="10" min={0} />
        <NumberField label="Round-trip efficiency" unit="%" value={efficiency} onChange={setEfficiency} example="90" min={0} max={100} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Solar surplus" unit="kWh/day" value={surplus} onChange={setSurplus} hint="Spare solar after daytime use." min={0} />
        <NumberField label="Overnight load" unit="kWh/day" value={overnight} onChange={setOvernight} hint="Use after sunset." min={0} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Import tariff" unit="c/kWh" value={importTariff} onChange={setImportTariff} min={0} />
        <NumberField label="Feed-in tariff" unit="c/kWh" value={feedIn} onChange={setFeedIn} min={0} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="Annual degradation" unit="%" value={degradation} onChange={setDegradation} min={0} max={99} />
        <NumberField label="VPP benefit" unit="A$/yr" value={vpp} onChange={setVpp} min={0} />
        <NumberField label="Horizon" unit="years" value={horizon} onChange={setHorizon} min={1} max={30} />
      </div>
    </>
  );

  const results = result && (
    <div className="flex flex-col gap-4">
      <p className="text-base font-medium">{result.paybackMessage}</p>
      <div className="grid grid-cols-2 gap-3">
        <ResultStat
          label="Simple payback"
          value={result.paybackYears === null ? "No payback" : `${result.paybackYears.toFixed(1)} yrs`}
          emphasis
        />
        <ResultStat label="First-year net savings" value={formatAUD(result.firstYearNetSavings)} />
        <ResultStat label="10-year cumulative" value={formatAUD(result.tenYearCumulativeSavings)} />
        <ResultStat label="Model horizon" value={`${result.horizonYears} yrs`} />
      </div>
      <p className="text-xs text-muted">
        Financing, tariff changes, maintenance and future rebates are excluded
        unless you enter them. This is a model, not a quote.
      </p>
      <Warnings warnings={result.warnings} />
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={error} results={results} />
  );
}
