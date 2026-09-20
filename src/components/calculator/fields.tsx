"use client";

import { useId, type ReactNode } from "react";

/** Field wrapper: visible label, unit, hint/example and error association. */
export function Field({
  label,
  htmlFor,
  unit,
  hint,
  example,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  unit?: string;
  hint?: string;
  example?: string;
  error?: string;
  children: ReactNode;
}) {
  const hintId = `${htmlFor}-hint`;
  const errId = `${htmlFor}-err`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-text">
        {label}
        {unit ? <span className="ml-1 text-muted">({unit})</span> : null}
      </label>
      {children}
      {hint && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
          {example ? ` e.g. ${example}` : ""}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  hint?: string;
  example?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

/** Accessible numeric input (spec §12.1) — never slider-only; label always visible. */
export function NumberField(props: NumberFieldProps) {
  const id = useId();
  const describedBy = [props.hint ? `${id}-hint` : null, props.error ? `${id}-err` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <Field
      label={props.label}
      htmlFor={id}
      unit={props.unit}
      hint={props.hint}
      example={props.example}
      error={props.error}
    >
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={props.value}
        min={props.min}
        max={props.max}
        step={props.step ?? "any"}
        placeholder={props.placeholder}
        aria-describedby={describedBy || undefined}
        aria-invalid={props.error ? true : undefined}
        onChange={(e) => props.onChange(e.target.value)}
        className="min-h-11 rounded-md border border-border bg-surface px-3 py-2 text-base tabular-nums focus:border-primary"
      />
    </Field>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}

export function SelectField(props: SelectFieldProps) {
  const id = useId();
  return (
    <Field label={props.label} htmlFor={id} hint={props.hint}>
      <select
        id={id}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        aria-describedby={props.hint ? `${id}-hint` : undefined}
        className="min-h-11 rounded-md border border-border bg-surface px-3 py-2 text-base focus:border-primary"
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** Tabs for simple/advanced or low/base/high (spec §11) with proper ARIA. */
export function ScenarioTabs({
  tabs,
  active,
  onChange,
  label = "Modes",
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  label?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-md border border-border p-0.5">
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`min-h-9 rounded px-3 py-1.5 text-sm font-medium ${
              selected ? "bg-primary text-white" : "text-text hover:bg-background"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** A large result number with a label (spec §10.4 big numeric typography). */
export function ResultStat({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="text-xs text-muted">{label}</div>
      <div
        className={`tabular-nums font-bold ${emphasis ? "text-2xl text-primary-dark" : "text-xl text-text"}`}
      >
        {value}
      </div>
    </div>
  );
}
