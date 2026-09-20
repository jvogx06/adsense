"use client";

import { useState } from "react";
import {
  electricityUsage,
  type ElectricityUsageResult,
} from "@/lib/calculators/electricity-usage";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { formatAUD, formatKWh } from "@/lib/format";
import { analytics } from "@/lib/analytics/events";
import { NumberField } from "../fields";
import { CalcFrame } from "../CalcFrame";

const CALC_ID = "electricity-usage";

interface Row {
  label: string;
  watts: string;
  quantity: string;
  hoursPerDay: string;
}

const emptyRow: Row = { label: "", watts: "", quantity: "1", hoursPerDay: "1" };

export function ElectricityUsageCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { label: "Fridge", watts: "150", quantity: "1", hoursPerDay: "24" },
    { label: "Heater", watts: "2000", quantity: "1", hoursPerDay: "4" },
  ]);
  const [tariffCents, setTariffCents] = useState("30");
  const [result, setResult] = useState<ElectricityUsageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(i: number, key: keyof Row, value: string) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, { ...emptyRow }]);
  }
  function removeRow(i: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  function calculate() {
    try {
      const res = electricityUsage(
        rows.map((r) => ({
          label: r.label,
          watts: parseLooseNumber(r.watts),
          quantity: parseLooseNumber(r.quantity),
          hoursPerDay: parseLooseNumber(r.hoursPerDay),
        })),
        parseLooseNumber(tariffCents),
      );
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
      <div className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <fieldset key={i} className="rounded-md border border-border p-3">
            <legend className="px-1 text-xs font-medium text-muted">
              Appliance {i + 1}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Name
                <input
                  value={row.label}
                  onChange={(e) => update(i, "label", e.target.value)}
                  placeholder="e.g. Fridge"
                  className="min-h-11 rounded-md border border-border px-3 py-2 text-base"
                />
              </label>
              <NumberField label="Power" unit="W" value={row.watts} onChange={(v) => update(i, "watts", v)} min={0} />
              <NumberField label="Quantity" value={row.quantity} onChange={(v) => update(i, "quantity", v)} min={0} />
              <NumberField label="Hours/day" value={row.hoursPerDay} onChange={(v) => update(i, "hoursPerDay", v)} min={0} max={24} />
            </div>
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="mt-2 text-xs font-medium text-danger hover:underline"
              >
                Remove appliance
              </button>
            )}
          </fieldset>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="self-start rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:border-primary"
        >
          + Add appliance
        </button>
      </div>
      <NumberField
        label="Electricity tariff"
        unit="c/kWh"
        value={tariffCents}
        onChange={setTariffCents}
        example="30"
        min={0}
      />
    </>
  );

  const results = result && (
    <div className="flex flex-col gap-4">
      <p className="text-base">
        Together these appliances use about{" "}
        <strong>{formatKWh(result.totalKWhPerYear)}</strong> a year, costing about{" "}
        <strong>{formatAUD(result.totalCostPerYear)}</strong> a year.
      </p>
      <div className="table-scroll">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th scope="col" className="py-1.5">Appliance</th>
              <th scope="col" className="py-1.5 text-right">kWh/yr</th>
              <th scope="col" className="py-1.5 text-right">Cost/yr</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r, i) => (
              <tr key={i} className="border-b border-border">
                <td className="py-1.5">{r.label}</td>
                <td className="py-1.5 text-right tabular-nums">{formatKWh(r.kWhPerYear)}</td>
                <td className="py-1.5 text-right tabular-nums">{formatAUD(r.costPerYear)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted">
        Daily total: <strong>{formatAUD(result.totalCostPerDay, { forceDecimals: true })}</strong> ·
        Monthly equivalent: <strong>{formatAUD(result.totalCostPerMonthEquivalent)}</strong>
      </p>
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={error} results={results} />
  );
}
