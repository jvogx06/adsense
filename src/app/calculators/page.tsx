import type { Metadata } from "next";
import { LinkCard, SectionHeading } from "@/components/ui/primitives";
import { HubLayout } from "@/components/templates/HubLayout";
import { calculatorsByGroup } from "@/lib/calculators/registry";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/calculators");

export default function CalculatorsHub() {
  const groups = calculatorsByGroup();
  return (
    <HubLayout
      slug="/calculators"
      breadcrumbs={[{ name: "Calculators", href: "/calculators" }]}
      intro="Every calculator here runs entirely in your browser, needs no login or email, and shows the formula and assumptions behind the result. Grouped by energy, solar, renovation and trades."
    >
      {(["Energy", "Solar", "Renovation"] as const).map((group) => (
        <section key={group} className="mb-10">
          <SectionHeading title={group} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups[group].map((c) => (
              <LinkCard key={c.id} href={c.route} title={c.name} description={c.shortDescription} />
            ))}
          </div>
        </section>
      ))}

      <section className="mb-4">
        <SectionHeading title="Trades" intro="A quote comparison worksheet is built into the trade cost guides." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LinkCard href="/trades/plumber-cost" title="Plumber cost & quote comparison" description="Sourced plumber rates plus a worksheet to compare itemised quotes." />
          <LinkCard href="/trades/electrician-cost" title="Electrician cost & quote comparison" description="Sourced electrician rates and a like-for-like quote comparison tool." />
        </div>
      </section>
    </HubLayout>
  );
}
