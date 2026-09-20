import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { QuoteComparison } from "@/components/calculator/tools/QuoteComparison";
import { Checklist } from "@/components/content/callouts";
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
      dataChecked={false}
      answer={
        <p>
          Split system installation cost depends on the unit capacity, how many heads
          you install, wall and electrical access, and pipe run length. Rather than a
          made-up national figure, compare itemised installer quotes and estimate running
          cost with your own tariff.
        </p>
      }
      related={[
        { label: "Air conditioner running cost calculator", href: "/calculators/air-conditioner-running-cost" },
        { label: "Ducted air conditioning cost", href: "/air-conditioning/ducted-air-conditioning-cost" },
        { label: "Ducted vs split comparison", href: "/air-conditioning/ducted-vs-split-system" },
        { label: "Electrician cost", href: "/trades/electrician-cost" },
      ]}
    >
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
