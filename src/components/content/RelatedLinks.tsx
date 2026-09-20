import Link from "next/link";

export interface RelatedLink {
  label: string;
  href: string;
  description?: string;
}

/**
 * 3–6 contextual internal links with descriptive anchor text (spec §11/§14.3).
 * No generic "read more"; no 30-link SEO block.
 */
export function RelatedLinks({
  title = "Related tools & guides",
  links,
}: {
  title?: string;
  links: RelatedLink[];
}) {
  const shown = links.slice(0, 6);
  if (shown.length === 0) return null;
  return (
    <nav aria-label={title} className="my-8">
      <h2 className="mb-3 text-lg font-semibold text-text">{title}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {shown.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-[var(--radius-card)] border border-border bg-surface p-4 no-underline transition-colors hover:border-primary"
            >
              <span className="font-medium text-primary-dark">{link.label}</span>
              {link.description && (
                <span className="mt-0.5 block text-sm text-muted">
                  {link.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
