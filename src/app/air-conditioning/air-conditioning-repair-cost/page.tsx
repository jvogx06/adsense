import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { DataTable } from "@/components/content/DataTable";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/air-conditioning/air-conditioning-repair-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/air-conditioning/air-conditioning-repair-cost"
      breadcrumbs={[
        { name: "Air Conditioning", href: "/air-conditioning" },
        { name: "Air Conditioning Repair Cost", href: "/air-conditioning/air-conditioning-repair-cost" },
      ]}
      answer={
        <p>
          Air conditioning repair cost is driven by the call-out fee, diagnosis time,
          the failed component and the labour to replace it. Small fixes are modest;
          compressor or major board failures can approach the cost of replacement — which
          is where a repair-versus-replace decision matters.
        </p>
      }
      related={[
        { label: "Electrician cost", href: "/trades/electrician-cost" },
        { label: "Air conditioner running cost calculator", href: "/calculators/air-conditioner-running-cost" },
        { label: "Ducted vs split comparison", href: "/air-conditioning/ducted-vs-split-system" },
      ]}
    >
      <h2 id="cost-factors">Cost factors</h2>
      <p>
        Most repairs combine a call-out/diagnosis fee with hourly labour and parts.
        Electrical faults may require a licensed electrician; refrigerant work requires a
        licensed technician. As a labour reference, our electrician cost guide lists
        sourced hourly rates:
      </p>
      <div className="my-6">
        <CostRangeCard datumId="electrician-hourly" />
      </div>

      <h2 id="repair-vs-replace">Repair vs replace</h2>
      <DataTable
        caption="A simple repair-versus-replace decision guide"
        columns={[
          { key: "situation", header: "Situation" },
          { key: "lean", header: "Usually lean towards" },
        ]}
        rows={[
          { situation: "Unit under warranty", lean: "Repair (often covered)" },
          { situation: "Minor part, unit < 8 years old", lean: "Repair" },
          { situation: "Major component (compressor/board), older unit", lean: "Get a replacement quote too" },
          { situation: "Repeated faults or obsolete parts", lean: "Replace" },
          { situation: "Old, inefficient unit with high running cost", lean: "Compare lifetime running cost of a new unit" },
        ]}
        footnote="General guidance only; a licensed technician should diagnose the specific fault."
      />

      <Callout tone="warning" title="Licensed work only">
        Electrical and refrigerant work on air conditioning must be done by appropriately
        licensed professionals. Do not attempt regulated repairs yourself. Where a legal
        or licensing requirement applies, confirm it with your state regulator.
      </Callout>
    </ArticleLayout>
  );
}
