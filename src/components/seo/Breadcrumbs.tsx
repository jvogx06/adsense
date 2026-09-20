import Link from "next/link";
import { breadcrumbLd, type BreadcrumbItem } from "@/lib/seo/jsonld";
import { JsonLd } from "./JsonLd";

/** Visible breadcrumbs + BreadcrumbList JSON-LD (spec §11/§15). */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const full: BreadcrumbItem[] = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {full.map((item, i) => {
            const last = i === full.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-text">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="hover:underline">
                      {item.name}
                    </Link>
                    <span aria-hidden="true" className="px-0.5 text-border">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(full)} />
    </>
  );
}
