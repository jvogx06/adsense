export interface TocItem {
  id: string;
  label: string;
  level?: 2 | 3;
}

/**
 * Table of contents generated from a page's H2/H3 anchors (spec §11).
 * Sticky on desktop; a plain collapsible <details> on mobile.
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 3) return null;
  const list = (
    <ol className="flex flex-col gap-1.5 text-sm">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
          <a href={`#${item.id}`} className="text-muted no-underline hover:text-primary-dark hover:underline">
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <details className="mb-6 rounded-[var(--radius-card)] border border-border bg-surface p-4 lg:hidden">
        <summary className="cursor-pointer font-semibold text-text">On this page</summary>
        <div className="mt-3">{list}</div>
      </details>
      <nav
        aria-label="On this page"
        className="hidden lg:block lg:sticky lg:top-20"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          On this page
        </p>
        {list}
      </nav>
    </>
  );
}
