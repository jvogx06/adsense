"use client";

import { useState } from "react";
import { compareQuotes, type QuoteComparisonResult } from "@/lib/calculators/quote-comparison";
import { parseLooseNumber } from "@/lib/calculators/shared";
import { formatAUD } from "@/lib/format";
import { NumberField } from "../fields";
import { CalcFrame } from "../CalcFrame";

const CALC_ID = "quote-comparison";

interface QuoteRow {
  label: string;
  totalCost: string;
  inclusions: string;
  warrantyYears: string;
  units: string;
}

const empty: QuoteRow = { label: "", totalCost: "", inclusions: "", warrantyYears: "", units: "" };

/**
 * Quote comparison worksheet (spec §12/§48.4). User-entered data only. Never
 * ranks a "best" quote, never fabricates an average; just surfaces comparable
 * facts and which inclusions are missing.
 */
export function QuoteComparison({ unitLabel = "unit" }: { unitLabel?: string }) {
  const [quotes, setQuotes] = useState<QuoteRow[]>([{ ...empty }, { ...empty }]);
  const [result, setResult] = useState<QuoteComparisonResult | null>(null);

  function update(i: number, key: keyof QuoteRow, value: string) {
    setQuotes((prev) => prev.map((q, idx) => (idx === i ? { ...q, [key]: value } : q)));
  }
  function addQuote() {
    setQuotes((prev) => (prev.length < 3 ? [...prev, { ...empty }] : prev));
  }

  function calculate() {
    const res = compareQuotes(
      quotes.map((q, i) => ({
        label: q.label || `Quote ${i + 1}`,
        totalCost: parseLooseNumber(q.totalCost) || 0,
        inclusions: q.inclusions.split(",").map((s) => s.trim()).filter(Boolean),
        warrantyYears: q.warrantyYears ? parseLooseNumber(q.warrantyYears) : undefined,
        units: q.units ? parseLooseNumber(q.units) : undefined,
      })),
    );
    setResult(res);
  }
  function reset() {
    setResult(null);
  }

  const form = (
    <div className="flex flex-col gap-3">
      {quotes.map((q, i) => (
        <fieldset key={i} className="rounded-md border border-border p-3">
          <legend className="px-1 text-xs font-medium text-muted">Quote {i + 1}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Name
              <input value={q.label} onChange={(e) => update(i, "label", e.target.value)} className="min-h-11 rounded-md border border-border px-3 py-2 text-base" />
            </label>
            <NumberField label="Total cost" unit="A$" value={q.totalCost} onChange={(v) => update(i, "totalCost", v)} min={0} />
            <NumberField label={`Units (${unitLabel})`} value={q.units} onChange={(v) => update(i, "units", v)} min={0} />
            <NumberField label="Warranty" unit="years" value={q.warrantyYears} onChange={(v) => update(i, "warrantyYears", v)} min={0} />
          </div>
          <label className="mt-2 flex flex-col gap-1 text-sm font-medium">
            Inclusions (comma-separated)
            <input
              value={q.inclusions}
              onChange={(e) => update(i, "inclusions", e.target.value)}
              placeholder="Removal, disposal, warranty"
              className="min-h-11 rounded-md border border-border px-3 py-2 text-base"
            />
          </label>
        </fieldset>
      ))}
      {quotes.length < 3 && (
        <button type="button" onClick={addQuote} className="self-start rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:border-primary">
          + Add quote
        </button>
      )}
    </div>
  );

  const results = result && (
    <div className="flex flex-col gap-4">
      <div className="table-scroll">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th scope="col" className="py-1.5">Quote</th>
              <th scope="col" className="py-1.5 text-right">Total</th>
              {result.canNormalisePerUnit && <th scope="col" className="py-1.5 text-right">Per {unitLabel}</th>}
              <th scope="col" className="py-1.5 text-right">Warranty</th>
              <th scope="col" className="py-1.5">Missing</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r, i) => (
              <tr key={i} className="border-b border-border align-top">
                <td className="py-1.5">{r.label}</td>
                <td className="py-1.5 text-right tabular-nums">{formatAUD(r.totalCost)}</td>
                {result.canNormalisePerUnit && (
                  <td className="py-1.5 text-right tabular-nums">
                    {r.costPerUnit !== undefined ? formatAUD(r.costPerUnit) : "—"}
                  </td>
                )}
                <td className="py-1.5 text-right tabular-nums">{r.warrantyYears ?? "—"}</td>
                <td className="py-1.5 text-xs text-danger">
                  {r.missingInclusions.length ? r.missingInclusions.join(", ") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">
        No “winner” is chosen and no market average is invented. Compare like for
        like and check what each quote leaves out.
      </p>
    </div>
  );

  return (
    <CalcFrame calcId={CALC_ID} form={form} onCalculate={calculate} onReset={reset} error={null} results={results} />
  );
}
