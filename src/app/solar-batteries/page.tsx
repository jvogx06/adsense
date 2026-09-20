import type { Metadata } from "next";
import { LinkCard, SectionHeading } from "@/components/ui/primitives";
import { HubLayout } from "@/components/templates/HubLayout";
import { LastChecked } from "@/components/content/sources";
import { Callout, Definition } from "@/components/content/callouts";
import { batteryProgram } from "@/data/programs/battery-program";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/solar-batteries");

export default function Page() {
  return (
    <HubLayout
      slug="/solar-batteries"
      breadcrumbs={[{ name: "Solar & Batteries", href: "/solar-batteries" }]}
      intro="Understand battery prices, payback, the federal program, system sizing and installation — using calculators with your own numbers and dated, cited sources."
    >
      {/* Federal program status card */}
      <section className="mb-10 rounded-[var(--radius-card)] border border-info/30 bg-info/5 p-6">
        <h2 className="text-xl font-semibold">Cheaper Home Batteries Program</h2>
        <p className="mt-2 text-muted">
          Indicative support of {batteryProgram.headlineSupport}, effective from{" "}
          {formatDate(batteryProgram.effectiveFrom)}. Support declines over time until 2030.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <LastChecked date={batteryProgram.checkedAt} />
          <a href={batteryProgram.officialUrl} target="_blank" rel="noopener noreferrer" className="font-medium">
            Official program page →
          </a>
          <a href="/solar-batteries/federal-battery-program" className="font-medium">
            Read our summary →
          </a>
        </div>
      </section>

      <section className="mb-10 rounded-[var(--radius-card)] border border-primary/30 bg-primary/5 p-6">
        <h2 className="text-xl font-semibold">Start with payback</h2>
        <p className="mt-2 text-muted">
          Whether a battery is worth it comes down to your numbers. Model it directly.
        </p>
        <p className="mt-3">
          <a href="/calculators/solar-battery-payback" className="font-semibold">
            Open the Solar Battery Payback Calculator →
          </a>
        </p>
      </section>

      <SectionHeading title="Guides & tools" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard href="/solar-batteries/solar-battery-cost" title="Solar battery cost" description="Dated market ranges and the components of your real cost." />
        <LinkCard href="/solar-batteries/solar-panel-installation-cost" title="Solar panel installation cost" description="A system-size cost framework using your inputs." />
        <LinkCard href="/solar-batteries/federal-battery-program" title="Federal battery program" description="Eligibility, the indicative discount and official sources." />
        <LinkCard href="/calculators/solar-system-size" title="Solar system size calculator" description="Size a system from your use and peak-sun-hours." />
        <LinkCard href="/calculators/battery-discount-estimator" title="Battery discount estimator" description="A rough, dated indicative discount (unofficial)." />
        <LinkCard href="/calculators/solar-battery-payback" title="Battery payback calculator" description="Simple payback and 10-year savings." />
      </div>

      <div className="mt-10">
        <SectionHeading title="Three numbers you need before deciding" />
        <Definition term="Installed net cost">
          What you actually pay after any rebate — not the sticker price of the hardware.
        </Definition>
        <Definition term="Usable battery capacity">
          The kWh you can actually cycle, which is less than the nominal capacity.
        </Definition>
        <Definition term="Import vs feed-in tariff difference">
          The gap between what you pay to import and what you earn to export decides how
          valuable it is to store energy rather than sell it.
        </Definition>
      </div>

      <div className="mt-10">
        <SectionHeading title="Battery buyer scenarios" />
        <ul className="content-prose">
          <li><strong>New solar + battery together:</strong> one install, shared costs, sized to your load.</li>
          <li><strong>Battery with an existing hybrid inverter:</strong> may avoid new inverter work.</li>
          <li><strong>Retrofit needing inverter work:</strong> extra cost if your current inverter can&apos;t add storage.</li>
        </ul>
      </div>

      <Callout tone="warning" title="Programs and rules change">
        Battery program settings and tariffs change over time. Always confirm current
        rules with the official source before committing.
      </Callout>
    </HubLayout>
  );
}
