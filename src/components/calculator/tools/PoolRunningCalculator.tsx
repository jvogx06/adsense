"use client";

import { useState } from "react";
import { poolRunningCost, type PoolRunningResult } from "@/lib/calculators/pool-running";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { formatAUD, formatKWh } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField, ResultStat } from "../fields";
import { CalcFrame, Warnings } from "../CalcFrame";

const CALC_ID = "pool-running-cost";

export function PoolRunningCalculator() {
  const [pumpKW, setPumpKW] = useState("1.2");
  const [pumpHours, setPumpHours] = useState("8");
  const [pumpDays, setPumpDays] = useState("365");
  const [tariff, setTariff] = useState("30");
  const [withHeater, setWithHeater] = useState(false);
  const [heaterKW, setHeaterKW] = useState("9");
  const [heaterCOP, setHeaterCOP] = useState("5");
  const [heaterHours, setHeaterHours] = useState("6");
  const [heaterDays, setHeaterDays] = useState("120");
  const [result, setResult] = useState<PoolRunningResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calculate() {
    try {
      const res = poolRunningCost({
        pumpKW: parseLooseNumber(pumpKW),
        pumpHoursPerDay: parseLooseNumber(pumpHours),
        pumpDaysPerYear: parseLooseNumber(pumpDays),
        tariffCents: parseLooseNumber(tariff),
        heaterThermalKW: withHeater ? parseLooseNumber(heaterKW) : undefined,
        heaterCOP: withHeater ? parseLooseNumber(heaterCOP) : undefined,
        heaterHoursPerDay: withHeater ? parseLooseNumber(heaterHours) : undefined,
        heaterDaysPerYear: withHeater ? parseLooseNumber(heaterDays) : undefined,
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
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Pump power" unit="kW" value={pumpKW} onChange={setPumpKW} example="1.2" min={0} />
        <NumberField label="Pump hours/day" value={pumpHours} onChange={setPumpHours} min={0} max={24} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Pump days/year" value={pumpDays} onChange={setPumpDays} min={0} max={365} />
        <NumberField label="Electricity tariff" unit="c/kWh" value={tariff} onChange={setTariff} min={0} />
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={withHeater} onChange={(e) => setWithHeater(e.target.checked)} className="h-4 w-4" />
        Include a heat-pump heater
      </label>
      {withHeater && (
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Heater output" unit="kW (thermal)" value={heaterKW} onChange={setHeaterKW} min={0} />
          <NumberField label="Heater COP" value={heaterCOP} onChange={setHeaterCOP} hint="Heat pump ~4–6." min={0} />
          <NumberField label="Heater hours/day" value={heaterHours} onChange={setHeaterHours} min={0} max={24} />
          <NumberField label="Heater days/year" value={heaterDays} onChange={setHeaterDays} min={0} max={365} />
        </div>
      )}
    </>
  );

  const results = result && (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        Estimated total energy of about <strong>{formatKWh(result.totalKWhPerYear)}</strong> a year,
        costing about <strong>{formatAUD(result.totalCostPerYear)}</strong> a year.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ResultStat label="Pump / yr" value={formatAUD(result.pumpCostPerYear)} />
        <ResultStat label="Heater / yr" value={formatAUD(result.heaterCostPerYear)} />
        <ResultStat label="Total / yr" value={formatAUD(result.totalCostPerYear)} emphasis />
      </div>
      <Warnings warnings={result.warnings} />
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={error} results={results} />
  );
}
