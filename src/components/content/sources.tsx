import { getSource } from "@/data/sources/registry";
import { resolveToSourceIds } from "@/lib/content/source-usage";
import { formatDate, daysSince } from "@/lib/format";
import type { SourceRecord } from "@/lib/validation/schemas";

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="inline-block align-baseline"
    >
      <path d="M14 4h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 4 10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Organisation + date badge linking to the source (spec §11). */
export function SourceBadge({ sourceId }: { sourceId: string }) {
  const source = getSource(sourceId);
  if (!source) return null;
  const date = source.updatedAt ?? source.publishedAt;
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted no-underline hover:border-info"
      title={`Source: ${source.organisation}${date ? ` (${formatDate(date)})` : ""}`}
    >
      <span className="font-medium text-text">Source: {source.organisation}</span>
      {date && <span>· {formatDate(date)}</span>}
      <ExternalIcon />
    </a>
  );
}

/** "Last checked" with a subtle stale indicator (spec §11/§60). */
export function LastChecked({
  date,
  label = "Last checked",
  staleAfterDays = 180,
}: {
  date: string;
  label?: string;
  staleAfterDays?: number;
}) {
  const age = daysSince(date);
  const stale = age > staleAfterDays;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${stale ? "bg-energy" : "bg-primary"}`}
      />
      {label}: {formatDate(date)}
      {stale && <span className="italic">(review due)</span>}
    </span>
  );
}

/** Numbered source list, primary sources first (spec §11/§30). */
export function SourceList({ sourceIds }: { sourceIds: string[] }) {
  const priority: Record<SourceRecord["sourceType"], number> = {
    government: 0,
    regulator: 1,
    research: 2,
    industry: 3,
    publisher: 4,
    policy: 5,
  };
  const records = resolveToSourceIds(sourceIds)
    .map((id) => getSource(id))
    .filter((s): s is SourceRecord => Boolean(s))
    .sort((a, b) => priority[a.sourceType] - priority[b.sourceType]);

  if (records.length === 0) return null;

  return (
    <ol className="flex list-decimal flex-col gap-3 pl-5">
      {records.map((s) => {
        const date = s.updatedAt ?? s.publishedAt;
        return (
          <li key={s.id} className="text-sm">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
            >
              {s.title} <ExternalIcon />
            </a>
            <div className="text-muted">
              {s.organisation}
              {date ? ` · ${formatDate(date)}` : ""} · Last checked{" "}
              {formatDate(s.checkedAt)}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
