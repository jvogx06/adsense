import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/content/sources";
import { RelatedLinks, type RelatedLink } from "@/components/content/RelatedLinks";
import { MethodologyCallout } from "@/components/content/callouts";
import { AdSlot } from "@/components/ads/AdSlot";
import { AdReadySpace } from "@/components/ads/AdReadySpace";
import { webApplicationLd, breadcrumbLd, type BreadcrumbItem } from "@/lib/seo/jsonld";
import { getContent } from "@/lib/content/registry";

/**
 * Calculator page template (spec §35/§49.1). One-sentence intro, the tool in
 * the first visible block (no ad before it), then server-rendered supporting
 * content for indexing. WebApplication schema (semantic only). The first ad
 * appears only after the result + explanation.
 */
export function CalculatorPageLayout({
  slug,
  breadcrumbs,
  intro,
  tool,
  children,
  related,
  sourceIds,
}: {
  slug: string;
  breadcrumbs: BreadcrumbItem[];
  intro: string;
  tool: ReactNode;
  children: ReactNode;
  related: RelatedLink[];
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
          <p className="mt-3 text-lg text-muted">{intro}</p>
        </header>

        {/* Clean space before the tool — never inside it. */}
        <AdReadySpace />

        <div className="mt-6">{tool}</div>

        {/* Space after the full tool + result/explanation block, before editorial. */}
        <AdReadySpace />

        <div className="mt-10 content-prose">{children}</div>

        <div className="mx-auto max-w-[46rem]">
          <MethodologyCallout />

          {/* First ad only after the result + supporting explanation. */}
          <AdSlot placement="article-end" />

          {sources.length > 0 && (
            <section aria-labelledby="calc-sources" className="mt-8 border-t border-border pt-6">
              <h2 id="calc-sources" className="mb-3 text-xl font-semibold">
                Sources
              </h2>
              <SourceList sourceIds={sources} />
            </section>
          )}

          <RelatedLinks links={related} />
        </div>
      </Container>
      <JsonLd
        data={[
          webApplicationLd({ name: entry.title, description: entry.description, slug: entry.slug }),
          breadcrumbLd([{ name: "Home", href: "/" }, ...breadcrumbs]),
        ]}
      />
    </div>
  );
}
