import Link from "next/link";
import type { ReactNode } from "react";
import { formatDate } from "@/lib/format";

type CalloutTone = "info" | "warning" | "neutral";

const toneStyles: Record<CalloutTone, string> = {
  info: "border-info/30 bg-info/5",
  warning: "border-energy/40 bg-energy/5",
  neutral: "border-border bg-background",
};

/** General editorial callout (spec §57 whitelist). */
export function Callout({
  title,
  tone = "neutral",
  children,
}: {
  title?: string;
  tone?: CalloutTone;
  children: ReactNode;
}) {
  return (
    <div className={`my-5 rounded-[var(--radius-card)] border p-4 ${toneStyles[tone]}`}>
      {title && <p className="mb-1 font-semibold text-text">{title}</p>}
      <div className="text-sm text-text">{children}</div>
    </div>
  );
}

/** "How we calculated this" card linking to methodology (spec §11). */
export function MethodologyCallout({ children }: { children?: ReactNode }) {
  return (
    <Callout title="How we calculated this" tone="info">
      {children ?? (
        <p>
          This estimate uses transparent inputs and a fixed formula. See our{" "}
          <Link href="/methodology" className="underline">
            methodology
          </Link>{" "}
          for how ranges, sources and assumptions work.
        </p>
      )}
    </Callout>
  );
}

/** Estimate-not-a-quote note shown near calculator results (spec §65). */
export function EstimateNotice() {
  return (
    <p className="text-xs text-muted">
      <strong className="text-text">Estimate, not a quote.</strong> Results are
      informational and depend on the values you enter. Always confirm with a
      licensed professional.
    </p>
  );
}

/** Update notice for regulation/program pages (spec §11/§60). */
export function UpdateNotice({
  effectiveFrom,
  children,
}: {
  effectiveFrom: string;
  children?: ReactNode;
}) {
  return (
    <Callout title={`Program settings effective from ${formatDate(effectiveFrom)}`} tone="warning">
      {children ?? (
        <p>Programs and rules change. Confirm current details with the official source.</p>
      )}
    </Callout>
  );
}

/** A short definition block (spec §57 whitelist). */
export function Definition({ term, children }: { term: string; children: ReactNode }) {
  return (
    <dl className="my-4 rounded-[var(--radius-card)] border border-border bg-background p-4">
      <dt className="font-semibold text-text">{term}</dt>
      <dd className="mt-1 text-sm text-muted">{children}</dd>
    </dl>
  );
}

/** A decision/comparison checklist (spec §57 whitelist). */
export function Checklist({ title, items }: { title?: string; items: string[] }) {
  return (
    <div className="my-5 rounded-[var(--radius-card)] border border-border bg-surface p-4">
      {title && <p className="mb-2 font-semibold text-text">{title}</p>}
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-primary"
            >
              <path
                d="m5 12 4.5 4.5L19 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
