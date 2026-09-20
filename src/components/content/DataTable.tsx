import type { ReactNode } from "react";
import { SourceBadge } from "./sources";

export interface DataTableColumn {
  key: string;
  header: string;
  /** Right-align numeric columns. */
  numeric?: boolean;
}

export interface DataTableRow {
  [key: string]: ReactNode;
}

/**
 * Accessible data table (spec §11/§28): caption, header scope, responsive
 * scroll wrapper and an optional source footnote. Text never shrinks below a
 * readable size.
 */
export function DataTable({
  caption,
  columns,
  rows,
  sourceId,
  footnote,
}: {
  caption: string;
  columns: DataTableColumn[];
  rows: DataTableRow[];
  sourceId?: string;
  footnote?: string;
}) {
  return (
    <figure className="my-6">
      <div className="table-scroll rounded-[var(--radius-card)] border border-border">
        <table className="w-full border-collapse text-sm">
          <caption className="px-4 pt-3 text-left text-sm font-semibold text-text">
            {caption}
          </caption>
          <thead>
            <tr className="border-b border-border bg-background">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-2.5 font-semibold text-text ${
                    col.numeric ? "text-right" : "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2.5 align-top ${
                      col.numeric ? "text-right tabular-nums" : "text-left"
                    }`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(sourceId || footnote) && (
        <figcaption className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          {sourceId && <SourceBadge sourceId={sourceId} />}
          {footnote && <span>{footnote}</span>}
        </figcaption>
      )}
    </figure>
  );
}
