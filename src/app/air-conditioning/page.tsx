import type { Metadata } from "next";
import { LinkCard, SectionHeading } from "@/components/ui/primitives";
import { HubLayout } from "@/components/templates/HubLayout";
import { DataTable } from "@/components/content/DataTable";
import { Checklist } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/air-conditioning");

export default function Page() {
  return (
    <HubLayout
      slug="/air-conditioning"
      breadcrumbs={[{ name: "Air Conditioning", href: "/air-conditioning" }]}
      intro="Air conditioning has three cost layers: the purchase and installation, the electricity to run it, and servicing or repairs over its life. This hub helps you plan all three, starting with a running-cost calculator."
    >
      <section className="mb-10 rounded-[var(--radius-card)] border border-primary/30 bg-primary/5 p-6">
        <h2 className="text-xl font-semibold">Start with running cost</h2>
        <p className="mt-2 text-muted">
          The biggest ongoing number is electricity. Estimate it with your own unit
          and tariff instead of relying on a national average.
        </p>
        <p className="mt-3">
          <a href="/calculators/air-conditioner-running-cost" className="font-semibold">
            Open the Air Conditioner Running Cost Calculator →
          </a>
        </p>
      </section>

      <SectionHeading title="Ducted vs split vs multi-split" intro="A structural comparison — we do not attach undocumented dollar figures." />
      <DataTable
        caption="How the main system types compare"
        columns={[
          { key: "type", header: "System" },
          { key: "suited", header: "Best suited for" },
          { key: "upfront", header: "Upfront-cost drivers" },
          { key: "running", header: "Running-cost drivers" },
          { key: "notes", header: "Zoning & maintenance" },
        ]}
        rows={[
          { type: "Ducted", suited: "Whole-home, consistent comfort", upfront: "Ductwork, zones, roof access, capacity", running: "Total capacity, zones used, insulation", notes: "Zoning available; more ducts to maintain" },
          { type: "Split", suited: "Single rooms or living areas", upfront: "Number of heads, wall access, capacity", running: "Room size, hours, unit efficiency", notes: "Per-room control; simple maintenance" },
          { type: "Multi-split", suited: "A few rooms from one outdoor unit", upfront: "Outdoor unit + multiple heads, pipe runs", running: "How many heads run at once", notes: "Independent rooms; one outdoor unit" },
        ]}
        footnote="Choose based on your home and needs; costs depend on your specific installation."
      />

      <div className="mt-10">
        <SectionHeading title="Installation cost guides" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LinkCard href="/air-conditioning/ducted-air-conditioning-cost" title="Ducted air conditioning cost" description="What drives ducted cost and how to compare quotes." />
          <LinkCard href="/air-conditioning/split-system-installation-cost" title="Split system installation cost" description="Factors that change split installation pricing." />
          <LinkCard href="/air-conditioning/air-conditioning-repair-cost" title="Air conditioning repair cost" description="Call-out, repair factors and repair-vs-replace." />
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading title="Running cost tools" />
        <div className="grid gap-4 sm:grid-cols-2">
          <LinkCard href="/calculators/air-conditioner-running-cost" title="Running cost calculator" description="Daily, monthly and annual cost from your inputs." />
          <LinkCard href="/air-conditioning/ducted-vs-split-system" title="Ducted vs split comparison" description="A decision guide and 10-year ownership worksheet." />
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading title="What changes costs across Australia?" />
        <p className="max-w-2xl text-muted">
          Climate, property size, insulation, electricity tariff and installation
          complexity all move the number — without a fixed percentage we can invent.
          Warmer regions typically run cooling more; well-insulated homes run less.
        </p>
      </div>

      <div className="mt-8">
        <Checklist
          title="Before you request quotes"
          items={[
            "Measure the rooms or areas you want conditioned.",
            "Note ceiling height, insulation and window orientation.",
            "Decide zoning needs (whole-home vs a few rooms).",
            "Ask each installer to itemise supply, install and any electrical work.",
            "Confirm the warranty and what servicing is included.",
          ]}
        />
      </div>
    </HubLayout>
  );
}
