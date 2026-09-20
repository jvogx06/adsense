"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchContent } from "@/lib/content/search-index";
import { analytics } from "@/lib/analytics/events";

export function SearchClient() {
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);

  const results = useMemo(() => searchContent(query), [query]);

  // Report internal search (debounced), never sending PII.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const id = window.setTimeout(() => {
      analytics.internalSearch(q.length, results.length);
    }, 600);
    return () => window.clearTimeout(id);
  }, [query, results.length]);

  return (
    <div>
      <label htmlFor="site-search" className="text-sm font-medium">
        Search calculators and guides
      </label>
      <input
        id="site-search"
        type="search"
        value={query}
        autoFocus
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g. solar battery, air conditioning, bathroom renovation"
        className="mt-2 min-h-11 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-base focus:border-primary"
      />

      <div className="mt-6">
        {query.trim().length < 2 ? (
          <p className="text-muted">Type at least two characters to search.</p>
        ) : results.length === 0 ? (
          <div className="text-muted">
            <p>
              No matching guides yet. Try &ldquo;solar battery&rdquo;, &ldquo;air
              conditioning&rdquo; or &ldquo;bathroom renovation&rdquo;.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {([
                ["/calculators", "Calculators"],
                ["/solar-batteries", "Solar & Batteries"],
                ["/air-conditioning", "Air Conditioning"],
                ["/renovations", "Renovations"],
                ["/trades", "Tradie Costs"],
              ] as const).map(([href, label]) => (
                <Link key={href} href={href} className="rounded-md border border-border px-3 py-1.5 text-sm no-underline hover:border-primary">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {results.map((r) => (
              <li key={r.slug}>
                <Link href={r.slug} className="block rounded-[var(--radius-card)] border border-border bg-surface p-4 no-underline hover:border-primary">
                  <span className="font-medium text-primary-dark">{r.title}</span>
                  <span className="mt-0.5 block text-sm text-muted">{r.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
