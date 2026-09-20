"use client";

import { useState } from "react";
import {
  airConditionerRunningCost,
  type AirConditionerResult,
} from "@/lib/calculators/air-conditioner";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { formatAUD, formatKWh } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField, SelectField, ScenarioTabs, ResultStat } from "../fields";
import { CalcFrame, Warnings } from "../CalcFrame";

const CALC_ID = "air-conditioner-running-cost";

export function AirConditionerCalculator() {
  const [mode, setMode] = useState("simple");
  const [powerMode, setPowerMode] = useState("input");
  const [inputPowerKW, setInputPowerKW] = useState("1");
  const [coolingCapacityKW, setCoolingCapacityKW] = useState("7");
  const [efficiencyRatio, setEfficiencyRatio] = useState("3");
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [daysPerWeek, setDaysPerWeek] = useState("7");
  const [weeksPerYear, setWeeksPerYear] = useState("13");
  const [loadFactor, setLoadFactor] = useState("1");
  const [standby, setStandby] = useState("0");
  const [tariffCents, setTariffCents] = useState("30");

  const [result, setResult] = useState<AirConditionerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calculate() {
    try {
      const advanced = mode === "advanced";
      const res = airConditionerRunningCost({
        ratedInputKW: powerMode === "input" ? parseLooseNumber(inputPowerKW) : undefined,
        coolingCapacityKW:
          powerMode === "capacity" ? parseLooseNumber(coolingCapacityKW) : undefined,
        efficiencyRatio:
          powerMode === "capacity" ? parseLooseNumber(efficiencyRatio) : undefined,
        hoursPerDay: parseLooseNumber(hoursPerDay),
        daysPerWeek: parseLooseNumber(daysPerWeek),
        weeksPerYear: advanced ? parseLooseNumber(weeksPerYear) : 52,
        tariffCents: parseLooseNumber(tariffCents),
        standbyKWhPerDay: advanced ? parseLooseNumber(standby) : 0,
        loadFactor: advanced ? parseLooseNumber(loadFactor) : 1,
      });
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
      <ScenarioTabs
        tabs={[
          { id: "simple", label: "Simple" },
          { id: "advanced", label: "Advanced" },
        ]}
        active={mode}
        onChange={setMode}
        label="Calculator mode"
      />
      <SelectField
        label="What do you know about the unit?"
        value={powerMode}
        onChange={setPowerMode}
        options={[
          { value: "input", label: "Electrical input power (kW)" },
          { value: "capacity", label: "Cooling capacity + efficiency (EER/COP)" },
        ]}
      />
      {powerMode === "input" ? (
        <NumberField
          label="Input power"
          unit="kW"
          value={inputPowerKW}
          onChange={setInputPowerKW}
          hint="From the label or manual."
          example="1.0"
          min={0}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Cooling capacity"
            unit="kW"
            value={coolingCapacityKW}
            onChange={setCoolingCapacityKW}
            example="7.0"
            min={0}
          />
          <NumberField
            label="Efficiency ratio (EER/COP)"
            value={efficiencyRatio}
            onChange={setEfficiencyRatio}
            hint="Higher is more efficient."
            example="3.0"
            min={0}
          />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Hours per day" value={hoursPerDay} onChange={setHoursPerDay} min={0} max={24} example="8" />
        <NumberField label="Days per week" value={daysPerWeek} onChange={setDaysPerWeek} min={0} max={7} example="7" />
      </div>
      {mode === "advanced" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField label="Weeks per year" value={weeksPerYear} onChange={setWeeksPerYear} min={0} max={52} example="13" />
          <NumberField
            label="Load factor"
            value={loadFactor}
            onChange={setLoadFactor}
            hint="0–1; compressor is not always at full draw."
            min={0}
            max={1}
            step={0.05}
          />
          <NumberField label="Standby" unit="kWh/day" value={standby} onChange={setStandby} min={0} />
        </div>
      )}
      <NumberField
        label="Electricity tariff"
        unit="c/kWh"
        value={tariffCents}
        onChange={setTariffCents}
        hint="Your usage rate in cents per kWh."
        example="30"
        min={0}
      />
    </>
  );

  const results = result && (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        At these inputs, the unit would use about{" "}
        <strong>{formatKWh(result.kWhPerYear)}</strong> a year and cost about{" "}
        <strong>{formatAUD(result.costPerYear)}</strong> a year to run.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ResultStat label="Per day" value={formatAUD(result.costPerDay, { forceDecimals: true })} />
        <ResultStat label="Per week" value={formatAUD(result.costPerWeek, { forceDecimals: true })} />
        <ResultStat label="Per month (equivalent)" value={formatAUD(result.costPerMonthEquivalent)} />
        <ResultStat label="Per year" value={formatAUD(result.costPerYear)} emphasis />
      </div>
      <p className="text-xs text-muted">
        Actual compressor draw varies with the thermostat, outdoor conditions,
        insulation and inverter behaviour.
      </p>
      <Warnings warnings={result.warnings} />
    </div>
  );

  return (
    <CalcFrame
      calcId={CALC_ID}
      form={form}
      onCalculate={calculate}
      onReset={reset}
      error={error}
      results={results}
    />
  );
}
