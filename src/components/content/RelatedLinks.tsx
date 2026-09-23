import Link from "next/link";
import { CategoryIcon, iconForSlug, type CategoryIconName } from "@/components/ui/CategoryIcon";

export interface RelatedLink {
  label: string;
  href: string;
  description?: string;
  /** Optional explicit icon; otherwise resolved from the href. */
  icon?: CategoryIconName;
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
        {shown.map((link) => {
          const icon = link.icon ?? iconForSlug(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-start gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4 no-underline transition-colors hover:border-primary"
              >
                {icon && (
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary"
                  >
                    <CategoryIcon name={icon} size={18} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium text-primary-dark">{link.label}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    >
                      →
                    </span>
                  </span>
                  {link.description && (
                    <span className="mt-0.5 block text-sm text-muted">
                      {link.description}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
