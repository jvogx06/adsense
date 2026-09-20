import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { DataTable } from "@/components/content/DataTable";
import { Checklist } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/air-conditioning/ducted-vs-split-system");

export default function Page() {
  return (
    <ArticleLayout
      slug="/air-conditioning/ducted-vs-split-system"
      breadcrumbs={[
        { name: "Air Conditioning", href: "/air-conditioning" },
        { name: "Ducted vs Split System", href: "/air-conditioning/ducted-vs-split-system" },
      ]}
      dataChecked={false}
      answer={
        <p>
          Ducted suits whole-home, even comfort with zoning; split (or multi-split) suits
          one or a few rooms at lower upfront cost. The right choice depends on how much of
          your home you heat and cool, and for how long. Compare total cost of ownership —
          upfront plus running cost over ~10 years — rather than sticker price alone.
        </p>
      }
      related={[
        { label: "Ducted air conditioning cost", href: "/air-conditioning/ducted-air-conditioning-cost" },
        { label: "Split system installation cost", href: "/air-conditioning/split-system-installation-cost" },
        { label: "Air conditioner running cost calculator", href: "/calculators/air-conditioner-running-cost" },
      ]}
    >
      <h2 id="decision">The decision at a glance</h2>
      <DataTable
        caption="Ducted vs split — a structural comparison (no undocumented prices)"
        columns={[
          { key: "factor", header: "Factor" },
          { key: "ducted", header: "Ducted" },
          { key: "split", header: "Split / multi-split" },
        ]}
        rows={[
          { factor: "Best for", ducted: "Whole-home comfort", split: "Single rooms / living areas" },
          { factor: "Upfront cost", ducted: "Higher (ductwork, zones)", split: "Lower per unit" },
          { factor: "Zoning", ducted: "Yes, by zone", split: "Per-room by unit" },
          { factor: "Running cost lever", ducted: "Zones used, total capacity", split: "Rooms run, hours" },
          { factor: "Maintenance", ducted: "Ducts + central unit", split: "Each head + outdoor unit" },
        ]}
      />

      <h2 id="ownership">10-year ownership worksheet</h2>
      <p>
        To compare total cost, add each option&apos;s installed quote to its estimated
        10-year running cost:
      </p>
      <ul>
        <li>Estimate annual running cost for each option with the{" "}
          <a href="/calculators/air-conditioner-running-cost">running cost calculator</a>.</li>
        <li>Multiply by 10 (adjust if your tariff or usage will change).</li>
        <li>Add the installed quote for each option.</li>
        <li>Compare the totals, not just the upfront price.</li>
      </ul>

      <Checklist
        title="What to weigh beyond cost"
        items={[
          "How many rooms you actually use at once.",
          "Whether even whole-home comfort matters to you.",
          "Ceiling/roof space for ducts.",
          "Future plans (extensions, resale).",
        ]}
      />
    </ArticleLayout>
  );
}
