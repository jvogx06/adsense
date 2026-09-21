import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { SourceList, LastChecked } from "@/components/content/sources";
import { RelatedLinks, type RelatedLink } from "@/components/content/RelatedLinks";
import { TableOfContents, type TocItem } from "@/components/content/TableOfContents";
import { AdSlot } from "@/components/ads/AdSlot";
import { articleLd, breadcrumbLd, type BreadcrumbItem } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/format";
import { getContent } from "@/lib/content/registry";
import { ogImageForEntry } from "@/lib/seo/og";
import { getAuthor, getReviewer } from "@/config/authors";

/**
 * Cost guide / article template (spec §13/§34/§49.2). Answer-first, trust row
 * under the H1, source-backed, with conservative ad placement (after the intro
 * and before related links — never between a worksheet input and its button).
 */
export function ArticleLayout({
  slug,
  breadcrumbs,
  answer,
  children,
  sourceIds,
  related,
  toc,
  dataChecked = true,
}: {
  slug: string;
  breadcrumbs: BreadcrumbItem[];
  answer: ReactNode;
  children: ReactNode;
  sourceIds?: string[];
  related: RelatedLink[];
  toc?: TocItem[];
  dataChecked?: boolean;
}) {
  const entry = getContent(slug);
  const sources = sourceIds ?? entry.sourceIds;
  const author = getAuthor("editorial-team");
  const reviewer = getReviewer(null); // no fake reviewers; real ones only

  const article = (
    <>
      <header className="mb-6">
        <h1 className="text-3xl font-bold sm:text-4xl">{entry.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span>By {author.name}</span>
          <span aria-hidden="true">·</span>
          <span>Updated {formatDate(entry.updatedAt)}</span>
          {reviewer && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                Reviewed by {reviewer.name}, {reviewer.qualification}
              </span>
            </>
          )}
          {dataChecked && sources.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <LastChecked date={entry.updatedAt} label="Data checked" />
            </>
          )}
        </div>
        <div className="mt-4 rounded-[var(--radius-card)] border border-border bg-surface p-4 text-lg">
          {answer}
        </div>
      </header>

      <AdSlot placement="article-after-intro" />

      <div className="content-prose">{children}</div>

      {sources.length > 0 && (
        <section aria-labelledby="sources-heading" className="mt-10 border-t border-border pt-6">
          <h2 id="sources-heading" className="mb-3 text-xl font-semibold">
            Sources
          </h2>
          <SourceList sourceIds={sources} />
        </section>
      )}

      <AdSlot placement="article-end" />

      <RelatedLinks links={related} />
    </>
  );

  return (
    <article className="py-8">
      <Container>
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-4">
          {toc && toc.length >= 3 ? (
            <div className="gap-10 lg:grid lg:grid-cols-[1fr_260px]">
              <div>{article}</div>
              <aside className="hidden lg:block">
                <div className="lg:sticky lg:top-20">
                  <TableOfContents items={toc} />
                </div>
              </aside>
            </div>
          ) : (
            <div className="mx-auto max-w-[46rem]">{article}</div>
          )}
        </div>
      </Container>
      <JsonLd
        data={[
          articleLd({
            headline: entry.title,
            description: entry.description,
            slug: entry.slug,
            datePublished: entry.publishedAt,
            dateModified: entry.updatedAt,
            authorName: author.name,
            image: ogImageForEntry(entry).url,
          }),
          breadcrumbLd([{ name: "Home", href: "/" }, ...breadcrumbs]),
        ]}
      />
    </article>
  );
}
