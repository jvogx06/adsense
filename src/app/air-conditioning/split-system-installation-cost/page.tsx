import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { QuoteComparison } from "@/components/calculator/tools/QuoteComparison";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { Callout, Checklist } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/air-conditioning/split-system-installation-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/air-conditioning/split-system-installation-cost"
      breadcrumbs={[
        { name: "Air Conditioning", href: "/air-conditioning" },
        { name: "Split System Installation Cost", href: "/air-conditioning/split-system-installation-cost" },
      ]}
      answer={
        <p>
          A cited 2026 Australian guide puts a smaller split system supplied and installed
          around A$600–A$750, two-unit systems around A$750–A$3,000 by capacity, and
          multi-split systems reaching roughly A$3,900–A$4,900. Installation labour alone is
          cited separately at about A$600–A$1,500 by complexity — a different scope we keep
          apart from the system totals.
        </p>
      }
      related={[
        { label: "Air conditioner running cost calculator", href: "/calculators/air-conditioner-running-cost" },
        { label: "Ducted air conditioning cost", href: "/air-conditioning/ducted-air-conditioning-cost" },
        { label: "Ducted vs split comparison", href: "/air-conditioning/ducted-vs-split-system" },
        { label: "Electrician cost", href: "/trades/electrician-cost" },
      ]}
    >
      <h2 id="system-totals">System totals (supplied &amp; installed)</h2>
      <p>These 2026 figures are the unit supplied and installed, by system type:</p>
      <div className="my-6 grid gap-4 sm:grid-cols-2">
        <CostRangeCard datumId="split-total-small" />
        <CostRangeCard datumId="split-total-two-unit" />
        <CostRangeCard datumId="split-total-multi" />
      </div>

      <h2 id="install-only">Installation labour only</h2>
      <p>
        A separate 2026 installation guide cites installation labour on its own — a
        different scope from the system totals above:
      </p>
      <div className="my-6">
        <CostRangeCard datumId="split-install-only" />
      </div>
      <Callout tone="warning" title="Different scopes, kept separate">
        We never merge hardware/system totals with installation-only labour into one
        &ldquo;average&rdquo;. Check exactly what a quote covers before comparing.
      </Callout>

      <h2 id="what-drives-cost">What affects the price</h2>
      <p>
        Bigger rooms need higher-capacity units. A back-to-back install on an external
        wall is simpler (and cheaper) than a long pipe run through the roof. New circuits
        or a switchboard upgrade add electrical cost. Multiple heads multiply the labour.
      </p>
      <h2 id="running-cost">Running cost</h2>
      <p>
        Estimate ongoing electricity with the{" "}
        <a href="/calculators/air-conditioner-running-cost">running cost calculator</a>,
        using the unit&apos;s input power (or capacity plus efficiency) and your tariff.
      </p>
      <h2 id="compare-quotes">Compare your quotes</h2>
      <div className="my-6">
        <QuoteComparison unitLabel="head" />
      </div>
      <Checklist
        title="Questions to ask installers"
        items={[
          "Is the capacity right for the room size and orientation?",
          "Is the standard pipe run length enough, or will extra be charged?",
          "Is any electrical work (new circuit, switchboard) included?",
          "What warranty applies to the unit and the installation?",
        ]}
      />
    </ArticleLayout>
  );
}
