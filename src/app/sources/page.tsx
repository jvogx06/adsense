import type { Metadata } from "next";
import Link from "next/link";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { sources } from "@/data/sources/registry";
import { sourceUsage } from "@/lib/content/source-usage";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/sources");

const typeLabels: Record<string, string> = {
  government: "Government",
  regulator: "Regulator",
  research: "Research",
  industry: "Industry body",
  publisher: "Publisher",
  policy: "Policy/reference",
};

export default function Page() {
  const usage = sourceUsage();

  return (
    <TrustLayout
      slug="/sources"
      breadcrumbs={[{ name: "Data Sources", href: "/sources" }]}
      lead="Our living source registry. Every market figure on the site traces to one of these entries, with the date we last checked it."
    >
      <p>
        Sorted by organisation. Reference/policy sources back our trust and legal pages and may
        not be cited by a specific cost page.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {[...sources]
          .sort((a, b) => a.organisation.localeCompare(b.organisation))
          .map((s) => {
            const pages = usage.get(s.id) ?? [];
            const date = s.updatedAt ?? s.publishedAt;
            return (
              <div key={s.id} className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold">
                    {s.title}
                  </a>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                    {typeLabels[s.sourceType] ?? s.sourceType}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {s.organisation}
                  {date ? ` · ${formatDate(date)}` : ""} · Last checked {formatDate(s.checkedAt)}
                </p>
                {pages.length > 0 ? (
                  <p className="mt-2 text-sm">
                    <span className="text-muted">Used on: </span>
                    {pages.map((p, i) => (
                      <span key={p.slug}>
                        {i > 0 ? ", " : ""}
                        <Link href={p.slug}>{p.title}</Link>
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-muted">Reference / policy source.</p>
                )}
              </div>
            );
          })}
      </div>
    </TrustLayout>
  );
}
