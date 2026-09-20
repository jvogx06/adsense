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
          A routine air conditioning service is the most common cost: a cited 2026 guide
          starts a basic split-system service from about A$86, with reported service costs
          around A$121–A$221 and some jobs above A$350. Repairs are separate and depend on
          the fault — a minor part is modest, while a compressor or major board failure can
          approach the cost of replacement.
        </p>
      }
      related={[
        { label: "Electrician cost", href: "/trades/electrician-cost" },
        { label: "Air conditioner running cost calculator", href: "/calculators/air-conditioner-running-cost" },
        { label: "Ducted vs split comparison", href: "/air-conditioning/ducted-vs-split-system" },
      ]}
    >
      <h2 id="service-cost">Service cost (sourced)</h2>
      <p>These 2026 figures are for routine service and maintenance, not repairs:</p>
      <div className="my-6 grid gap-4 sm:grid-cols-2">
        <CostRangeCard datumId="ac-service-basic" />
        <CostRangeCard datumId="ac-service-average" />
        <CostRangeCard datumId="ac-service-higher" />
      </div>

      <h2 id="scope-difference">Service vs diagnosis vs repair vs replacement</h2>
      <DataTable
        caption="Different jobs, different costs — don't confuse a service price with a repair"
        columns={[
          { key: "job", header: "Job" },
          { key: "what", header: "What it covers" },
        ]}
        rows={[
          { job: "Routine service", what: "Clean, check and maintain a working unit (the sourced figures above)." },
          { job: "Diagnosis / call-out", what: "Attend and identify a fault; may be credited toward a repair." },
          { job: "Repair", what: "Fix the identified fault; cost depends on the part and labour." },
          { job: "Replacement parts", what: "The price of the specific component, on top of labour." },
          { job: "Major component repair", what: "Compressor or main board — can approach replacement cost." },
        ]}
        footnote="A service price is not the price of replacing a compressor. A licensed technician should diagnose the specific fault."
      />

      <h2 id="cost-factors">Repair cost factors</h2>
      <p>
        Repairs combine a call-out/diagnosis fee with hourly labour and parts. Electrical
        faults may require a licensed electrician; refrigerant work requires a licensed
        technician. As a secondary labour reference only, our electrician cost guide lists
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
