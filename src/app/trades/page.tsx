import type { Metadata } from "next";
import { LinkCard, SectionHeading } from "@/components/ui/primitives";
import { HubLayout } from "@/components/templates/HubLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { CostRangeChart } from "@/components/content/charts/CostRangeChart";
import { QuoteComparison } from "@/components/calculator/tools/QuoteComparison";
import { Definition, Checklist } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/trades");

export default function Page() {
  return (
    <HubLayout
      slug="/trades"
      breadcrumbs={[{ name: "Tradie Costs", href: "/trades" }]}
      intro="Understand tradie pricing before you hire — hourly rates, call-out fees and fixed quotes — with sourced references and a quote comparison worksheet. This is a cost resource, not a &ldquo;near me&rdquo; directory."
    >
      <SectionHeading title="How tradie pricing works" />
      <Definition term="Hourly rate">Labour charged per hour, usually excluding parts and any call-out fee.</Definition>
      <Definition term="Call-out / service fee">A fee to attend, sometimes covering the first period of work.</Definition>
      <Definition term="Fixed quote">A set price for a defined scope — best for comparing like for like.</Definition>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <CostRangeCard datumId="plumber-hourly" />
        <CostRangeCard datumId="electrician-hourly" />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <CostRangeChart
          title="Hourly rate — electrician vs plumber"
          datumIds={["electrician-hourly", "plumber-hourly"]}
          labelFor={(d) => (d.id === "electrician-hourly" ? "Electrician" : "Plumber")}
          intro="Typical hourly labour ranges from national cost guides (excludes parts and call-out)."
        />
        <CostRangeChart
          title="Call-out / service fee — electrician vs plumber"
          datumIds={["electrician-service-fee", "plumber-callout"]}
          labelFor={(d) => (d.id === "electrician-service-fee" ? "Electrician" : "Plumber")}
          intro="Typical attendance/first-visit fees, charged separately from hourly labour."
        />
      </div>

      <div className="mt-10">
        <SectionHeading title="Cost guides" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LinkCard href="/trades/plumber-cost" title="Plumber cost" description="Sourced hourly and call-out ranges." />
          <LinkCard href="/trades/electrician-cost" title="Electrician cost" description="Sourced hourly and service-fee ranges." />
          <LinkCard href="/trades/switchboard-upgrade-cost" title="Switchboard upgrade cost" description="The variables that drive the price." />
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading title="Compare quotes (example tool)" intro="User-entered data only — the values below are examples, not real vendors." />
        <QuoteComparison unitLabel="job" />
      </div>

      <div className="mt-10">
        <SectionHeading title="Emergency vs standard hours" />
        <p className="max-w-2xl text-muted">
          After-hours and emergency work often costs more, but we don&apos;t publish a
          fabricated premium without a dated source. Ask each trade how they price
          out-of-hours attendance.
        </p>
      </div>

      <div className="mt-8">
        <Checklist
          title="What to check on an itemised quote"
          items={[
            "Is it a fixed quote or an hourly estimate?",
            "Are parts/materials included or extra?",
            "Is a call-out fee separate?",
            "What's the warranty on parts and labour?",
            "Is the tradesperson licensed for the work?",
          ]}
        />
      </div>
    </HubLayout>
  );
}
