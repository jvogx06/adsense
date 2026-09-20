"use client";

import { useRef, type ReactNode } from "react";
import { analytics } from "@/lib/analytics/events";
import { EstimateNotice } from "@/components/content/callouts";
import { ShareTools } from "./ShareTools";

/**
 * Shared calculator frame (spec §12.1/§35): input panel and result panel, an
 * explicit Calculate button, a Reset button, inline error region and share/
 * print tools. No ad is ever placed between the last input and the Calculate
 * button or pinned to the primary result — ads live outside this frame.
 */
export function CalcFrame({
  calcId,
  form,
  results,
  error,
  onCalculate,
  onReset,
}: {
  calcId: string;
  form: ReactNode;
  results: ReactNode;
  error: string | null;
  onCalculate: () => void;
  onReset: () => void;
}) {
  const started = useRef(false);

  function markStarted() {
    if (!started.current) {
      started.current = true;
      analytics.calculatorStarted(calcId);
    }
  }

  return (
    <div className="grid gap-6 rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-card lg:grid-cols-2">
      <form
        onFocusCapture={markStarted}
        onSubmit={(e) => {
          e.preventDefault();
          onCalculate();
        }}
        className="flex flex-col gap-4"
        noValidate
      >
        {form}
        {error && (
          <p role="alert" className="rounded-md border border-danger/40 bg-danger/5 px-3 py-2 text-sm font-medium text-danger">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-4 rounded-md bg-background p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Your estimate
        </h2>
        {results ?? (
          <p className="text-sm text-muted">
            Enter your values and select <strong>Calculate</strong> to see the estimate.
          </p>
        )}
        {results && (
          <div className="mt-1 flex flex-col gap-3 border-t border-border pt-3">
            <EstimateNotice />
            <ShareTools />
          </div>
        )}
      </div>
    </div>
  );
}

/** Renders calculator warnings (soft issues) below a result. */
export function Warnings({ warnings }: { warnings: string[] }) {
  if (!warnings || warnings.length === 0) return null;
  return (
    <ul className="flex flex-col gap-1.5 rounded-md border border-energy/40 bg-energy/5 p-3 text-xs text-text">
      {warnings.map((w, i) => (
        <li key={i}>• {w}</li>
      ))}
    </ul>
  );
}
