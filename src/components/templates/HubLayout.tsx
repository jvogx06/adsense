import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/content/sources";
import { webPageLd, breadcrumbLd, type BreadcrumbItem } from "@/lib/seo/jsonld";
import { getContent } from "@/lib/content/registry";

/**
 * Hub template (spec §48/§49.3). Uses semantic WebPage schema (not Article),
 * a unique cluster explanation and descriptive cards. Never noindex for P0 hubs.
 */
export function HubLayout({
  slug,
  breadcrumbs,
  intro,
  children,
  sourceIds,
}: {
  slug: string;
  breadcrumbs: BreadcrumbItem[];
  intro: ReactNode;
  children: ReactNode;
  sourceIds?: string[];
}) {
  const entry = getContent(slug);
  const sources = sourceIds ?? entry.sourceIds;

  return (
    <div className="py-8">
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        <header className="mt-4 max-w-3xl">
          <h1 className="text-3xl font-bold sm:text-4xl">{entry.title}</h1>
          <div className="mt-3 text-lg text-muted">{intro}</div>
        </header>

        <div className="mt-8">{children}</div>

        {sources.length > 0 && (
          <section aria-labelledby="hub-sources" className="mt-12 border-t border-border pt-6">
            <h2 id="hub-sources" className="mb-3 text-xl font-semibold">
              Sources
            </h2>
            <SourceList sourceIds={sources} />
          </section>
        )}
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
