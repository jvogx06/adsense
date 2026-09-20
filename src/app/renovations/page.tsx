import type { Metadata } from "next";
import { LinkCard, SectionHeading } from "@/components/ui/primitives";
import { HubLayout } from "@/components/templates/HubLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { Checklist } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/renovations");

export default function Page() {
  return (
    <HubLayout
      slug="/renovations"
      breadcrumbs={[{ name: "Renovations", href: "/renovations" }]}
      intro="Renovation cost ranges are orientative and depend heavily on scope and finishes. Use these sourced guides to inform your numbers, then build a realistic budget."
    >
      <section className="mb-10 rounded-[var(--radius-card)] border border-primary/30 bg-primary/5 p-6">
        <h2 className="text-xl font-semibold">Build your renovation budget</h2>
        <p className="mt-2 text-muted">
          A worksheet for your own low/base/high figures with a contingency buffer.
        </p>
        <p className="mt-3">
          <a href="/calculators/home-renovation-budget" className="font-semibold">
            Open the Home Renovation Budget Calculator →
          </a>
        </p>
      </section>

      <SectionHeading title="Cost guides" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard href="/renovations/bathroom-renovation-cost" title="Bathroom renovation cost" description="Sourced tiers and a budget worksheet." />
        <LinkCard href="/renovations/kitchen-renovation-cost" title="Kitchen renovation cost" description="A sourced ballpark and what changes it." />
        <LinkCard href="/renovations/roof-restoration-cost" title="Roof restoration cost" description="Per-m² ranges and an area worksheet." />
        <LinkCard href="/renovations/roof-replacement-cost" title="Roof replacement cost" description="Material table and area estimator." />
        <LinkCard href="/renovations/whole-home-renovation-cost" title="Whole-home renovation cost" description="Planning context and a budget tool." />
      </div>

      <div className="mt-10">
        <SectionHeading title="Sourced ranges (current source records only)" intro="We show ranges only where we hold a dated source." />
        <div className="grid gap-4 sm:grid-cols-2">
          <CostRangeCard datumId="bathroom-reno-overall" />
          <CostRangeCard datumId="kitchen-reno-ballpark" />
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading title="Why quotes differ" />
        <p className="max-w-2xl text-muted">
          Labour, demolition, access, materials, relocating services, approvals and hidden
          conditions (asbestos, rot, non-compliant wiring) all move the price. Two quotes for
          the &ldquo;same&rdquo; job can differ simply because they include different scope.
        </p>
      </div>

      <div className="mt-8">
        <Checklist
          title="Checklist for comparing budgets"
          items={[
            "Confirm the scope is identical across quotes.",
            "Check what's excluded (disposal, permits, make-good).",
            "Confirm GST treatment and how variations are priced.",
            "Check warranties and who handles approvals.",
          ]}
        />
      </div>
    </HubLayout>
  );
}
