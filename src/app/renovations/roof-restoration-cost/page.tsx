import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/renovations/roof-restoration-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/renovations/roof-restoration-cost"
      breadcrumbs={[
        { name: "Renovations", href: "/renovations" },
        { name: "Roof Restoration Cost", href: "/renovations/roof-restoration-cost" },
      ]}
      answer={
        <p>
          Roof <em>restoration</em> (cleaning, repairs and re-coating) is often priced per
          square metre, and the rate falls as the roof gets larger. A cited guide lists
          roughly A$28–38/m² for small roofs, A$22–28/m² for medium and A$17–22/m² for
          larger roofs. This is restoration, not a full roof replacement.
        </p>
      }
      related={[
        { label: "Roof replacement cost", href: "/renovations/roof-replacement-cost" },
        { label: "Home renovation budget calculator", href: "/calculators/home-renovation-budget" },
        { label: "Renovation costs hub", href: "/renovations" },
      ]}
    >
      <h2 id="ranges">Per-square-metre ranges</h2>
      <p>Each band below carries its exact scope, source and date:</p>
      <div className="my-6 grid gap-4 sm:grid-cols-2">
        <CostRangeCard datumId="roof-restoration-small" />
        <CostRangeCard datumId="roof-restoration-medium" />
        <CostRangeCard datumId="roof-restoration-large" />
      </div>

      <h2 id="worksheet">Estimate your area</h2>
      <p>
        Multiply your roof area (m²) by the per-m² band that matches your roof size. For
        example, a 150 m² medium roof at A$22–28/m² is roughly A$3,300–A$4,200. Treat this
        as a source-based range, not a quote.
      </p>

      <h2 id="factors">Factors that change the result</h2>
      <ul>
        <li>Roof size (the rate falls with area).</li>
        <li>Roof condition and the extent of repairs needed.</li>
        <li>Access, pitch and number of storeys.</li>
        <li>Coating system and number of coats.</li>
      </ul>

      <Callout tone="warning" title="Restoration is not replacement">
        Restoration and replacement are different scopes with very different prices. We keep
        these datasets separate and never blend them into a single figure. If your roof needs
        replacing, see the <a href="/renovations/roof-replacement-cost">roof replacement guide</a>.
      </Callout>
    </ArticleLayout>
  );
}
