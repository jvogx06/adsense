import type { ReactNode } from "react";
import Link from "next/link";
import { SourceBadge, LastChecked } from "@/components/content/sources";

/**
 * Shared wrapper for the site's lightweight CSS/SVG data visuals (spec §6/§7).
 * Every chart declares what kind of figure it shows, cites its source and the
 * date it was checked, and always exposes the underlying numbers as text next
 * to the bars — the visual never carries data on its own.
 */
export type ChartKind = "range" | "source-backed" | "example" | "estimate";

const KIND_LABEL: Record<ChartKind, string> = {
  range: "Source-backed range",
  "source-backed": "Source-backed figure",
  example: "Example (formula-derived)",
  estimate: "Estimate",
};

export function ChartFrame({
  title,
  kind,
  sourceIds = [],
  checkedAt,
  intro,
  footnote,
  children,
}: {
  title: string;
  kind: ChartKind;
  sourceIds?: string[];
  checkedAt?: string;
  intro?: ReactNode;
  footnote?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="chart-frame my-6 rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-card">
      <figcaption className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <span className="text-base font-semibold text-text">{title}</span>
        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted">
          {KIND_LABEL[kind]}
        </span>
      </figcaption>

      {intro && <div className="mb-3 text-sm text-muted">{intro}</div>}

      {children}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-3">
        {sourceIds.map((id) => (
          <SourceBadge key={id} sourceId={id} />
        ))}
        {checkedAt && <LastChecked date={checkedAt} label="Data checked" />}
        <Link href="/methodology" className="text-xs text-info hover:underline">
          How we use sources
        </Link>
      </div>

      {footnote && <div className="mt-2 text-xs text-muted">{footnote}</div>}
    </figure>
  );
}
