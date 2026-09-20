"use client";

import { useState } from "react";
import { evChargingCost, type EvChargingResult } from "@/lib/calculators/ev-charging";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { formatAUD, formatKWh } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField, ResultStat } from "../fields";
import { CalcFrame, Warnings } from "../CalcFrame";

const CALC_ID = "ev-charging-cost";

export function EvChargingCalculator() {
  const [consumption, setConsumption] = useState("18");
  const [kmPerWeek, setKmPerWeek] = useState("250");
  const [homeTariff, setHomeTariff] = useState("30");
  const [publicTariff, setPublicTariff] = useState("55");
  const [homeShare, setHomeShare] = useState("80");
  const [loss, setLoss] = useState("10");
  const [result, setResult] = useState<EvChargingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calculate() {
    try {
      const res = evChargingCost({
        consumptionKWhPer100km: parseLooseNumber(consumption),
        kmPerWeek: parseLooseNumber(kmPerWeek),
        homeTariffCents: parseLooseNumber(homeTariff),
        publicTariffCents: parseLooseNumber(publicTariff),
        homeSharePercent: parseLooseNumber(homeShare),
        chargingLossPercent: parseLooseNumber(loss),
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
      <NumberField label="Vehicle consumption" unit="kWh/100km" value={consumption} onChange={setConsumption} example="18" min={0} />
      <NumberField label="Distance" unit="km/week" value={kmPerWeek} onChange={setKmPerWeek} example="250" min={0} />
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Home tariff" unit="c/kWh" value={homeTariff} onChange={setHomeTariff} min={0} />
        <NumberField label="Public tariff" unit="c/kWh" value={publicTariff} onChange={setPublicTariff} min={0} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Home charging share" unit="%" value={homeShare} onChange={setHomeShare} min={0} max={100} />
        <NumberField label="Charging losses" unit="%" value={loss} onChange={setLoss} hint="Energy lost charging." min={0} max={99} />
      </div>
    </>
  );

  const results = result && (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        Driving <strong>{Math.round(result.kmPerYear).toLocaleString("en-AU")} km</strong> a year
        needs about <strong>{formatKWh(result.gridKWhPerYear)}</strong> from the grid, costing about{" "}
        <strong>{formatAUD(result.annualCostMixed)}</strong> a year at your mix.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ResultStat label="Home only / yr" value={formatAUD(result.annualCostHomeOnly)} />
        <ResultStat label="Your mix / yr" value={formatAUD(result.annualCostMixed)} emphasis />
        <ResultStat label="Public only / yr" value={formatAUD(result.annualCostPublicOnly)} />
      </div>
      <p className="text-xs text-muted">
        Real-world efficiency varies with driving, climate and charging. This does
        not imply an exact vehicle efficiency.
      </p>
      <Warnings warnings={result.warnings} />
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={error} results={results} />
  );
}
