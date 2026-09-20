import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { QuoteComparison } from "@/components/calculator/tools/QuoteComparison";
import { Checklist } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/air-conditioning/ducted-air-conditioning-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/air-conditioning/ducted-air-conditioning-cost"
      breadcrumbs={[
        { name: "Air Conditioning", href: "/air-conditioning" },
        { name: "Ducted Air Conditioning Cost", href: "/air-conditioning/ducted-air-conditioning-cost" },
      ]}
      dataChecked={false}
      answer={
        <p>
          Ducted air conditioning cost depends on your home&apos;s size, the system
          capacity, the number of zones and how hard the installation is — so a single
          national price is misleading. The most reliable way to understand your cost is
          to compare itemised installer quotes and estimate running cost with your own
          numbers.
        </p>
      }
      related={[
        { label: "Air conditioner running cost calculator", href: "/calculators/air-conditioner-running-cost" },
        { label: "Split system installation cost", href: "/air-conditioning/split-system-installation-cost" },
        { label: "Ducted vs split comparison", href: "/air-conditioning/ducted-vs-split-system" },
        { label: "Electrician cost", href: "/trades/electrician-cost" },
      ]}
    >
      <h2 id="what-drives-cost">What drives ducted cost</h2>
      <p>
        Ducted systems are priced around the total cooling/heating capacity your home
        needs, the ductwork and zoning, roof or ceiling access, and any electrical
        upgrades. Larger homes, more zones and difficult roof space all push the quote
        up. We don&apos;t publish a fabricated national figure — the honest number is
        the one on comparable itemised quotes for your home.
      </p>

      <h2 id="running-cost">Running cost</h2>
      <p>
        Running cost is separate from installation and depends on how much of the system
        you actually use. Estimate it with the{" "}
        <a href="/calculators/air-conditioner-running-cost">running cost calculator</a>{" "}
        using the unit&apos;s input power and your tariff.
      </p>

      <h2 id="compare-quotes">Compare your quotes</h2>
      <p>
        Enter up to three quotes to compare them like for like. This uses only the data
        you enter and never picks a &ldquo;winner&rdquo; or invents a market average.
      </p>
      <div className="my-6">
        <QuoteComparison unitLabel="zone" />
      </div>

      <Checklist
        title="Questions to ask before comparing quotes"
        items={[
          "Is the quote for the same capacity and number of zones?",
          "Does it include all electrical work and roof access?",
          "Are removal of an old system and making good included?",
          "What is the warranty on parts and labour?",
        ]}
      />
    </ArticleLayout>
  );
}
