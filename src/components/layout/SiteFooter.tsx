import Link from "next/link";
import { footerColumns } from "@/config/navigation";
import { siteConfig } from "@/config/site";

/** Four-column responsive footer with legal/trust links (spec §6.3/§11/§65). */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerColumns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                {col.heading}
              </h2>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text no-underline hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted">
          <p className="font-medium text-text">
            Independent information site — not a government service.
          </p>
          <p className="mt-2 max-w-2xl">
            Estimates and cost ranges on this site are for general information
            only, are not quotes, and can change as sources and programs update.
            Always confirm figures with a licensed professional and official
            sources before making a decision.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              © {year} {siteConfig.siteName}
            </span>
            {siteConfig.contactEmail ? (
              <a href={`mailto:${siteConfig.contactEmail}`} className="hover:underline">
                {siteConfig.contactEmail}
              </a>
            ) : (
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            )}
            <Link href="/privacy-policy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/advertising-disclosure" className="hover:underline">
              Advertising disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
