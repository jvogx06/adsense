import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageLd, breadcrumbLd, type BreadcrumbItem } from "@/lib/seo/jsonld";
import { getContent } from "@/lib/content/registry";
import { formatDate } from "@/lib/format";

/**
 * Trust / legal / simple-content template. Centred prose column, breadcrumbs,
 * an "updated" date and WebPage schema. No ads on legal/utility pages (spec §18.1).
 */
export function TrustLayout({
  slug,
  breadcrumbs,
  children,
  lead,
}: {
  slug: string;
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
  lead?: ReactNode;
}) {
  const entry = getContent(slug);
  return (
    <div className="py-8">
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        <div className="mx-auto mt-4 max-w-[46rem]">
          <header className="mb-6">
            <h1 className="text-3xl font-bold sm:text-4xl">{entry.title}</h1>
            <p className="mt-2 text-sm text-muted">Updated {formatDate(entry.updatedAt)}</p>
            {lead && <div className="mt-4 text-lg text-muted">{lead}</div>}
          </header>
          <div className="content-prose">{children}</div>
        </div>
      </Container>
      <JsonLd
        data={[
          webPageLd({ name: entry.title, description: entry.description, slug: entry.slug }),
          breadcrumbLd([{ name: "Home", href: "/" }, ...breadcrumbs]),
        ]}
      />
    </div>
  );
}
