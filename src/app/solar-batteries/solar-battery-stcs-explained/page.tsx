import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { DataTable } from "@/components/content/DataTable";
import { Callout } from "@/components/content/callouts";
import { batteryProgram } from "@/data/programs/battery-program";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/solar-batteries/solar-battery-stcs-explained");

export default function Page() {
  return (
    <ArticleLayout
      slug="/solar-batteries/solar-battery-stcs-explained"
      breadcrumbs={[
        { name: "Solar & Batteries", href: "/solar-batteries" },
        { name: "Solar Battery STCs Explained", href: "/solar-batteries/solar-battery-stcs-explained" },
      ]}
      answer={
        <p>
          Under the federal Cheaper Home Batteries Program, home batteries are discounted
          through <strong>small-scale technology certificates (STCs)</strong>, not a flat
          percentage. Your estimated STCs are your usable capacity (up to{" "}
          {batteryProgram.stcSupportMaxKWh} kWh) run through a <strong>capacity taper</strong>{" "}
          and multiplied by a dated <strong>STC factor</strong> that declines over time. The
          dollar value depends on the certificate market.
        </p>
      }
      related={[
        { label: "Federal battery discount estimator", href: "/calculators/battery-discount-estimator", description: "Estimate your STCs from capacity and install date." },
        { label: "Cheaper Home Batteries Program explained", href: "/solar-batteries/federal-battery-program" },
        { label: "Solar battery cost in Australia", href: "/solar-batteries/solar-battery-cost" },
        { label: "Usable capacity explained", href: "/solar-batteries/usable-capacity-explained" },
      ]}
    >
      <h2 id="how-stcs-work">How STCs reduce battery cost</h2>
      <p>
        STCs are certificates created when an eligible battery is installed. Your installer
        typically applies their value as an upfront discount. The number of STCs is worked out
        from your usable capacity via a taper, then multiplied by the STC factor for your
        installation date:
      </p>
      <ul>
        <li><strong>100%</strong> of the factor on the first 14 kWh of usable capacity;</li>
        <li><strong>60%</strong> of the factor from 14–28 kWh;</li>
        <li><strong>15%</strong> of the factor from 28–{batteryProgram.stcSupportMaxKWh} kWh;</li>
        <li>capacity above {batteryProgram.stcSupportMaxKWh} kWh earns no additional STC support.</li>
      </ul>

      <h2 id="factor-schedule">The STC factor declines over time</h2>
      <p>
        The factor steps down through 2030, so installing earlier generally yields more STCs
        for the same battery. Current dated schedule:
      </p>
      <DataTable
        caption="Dated STC factor schedule (from the program dataset)"
        columns={[
          { key: "period", header: "Installation period" },
          { key: "factor", header: "STC factor", numeric: true },
        ]}
        rows={batteryProgram.stcFactorSchedule.map((p) => ({
          period: p.label,
          factor: String(p.factor),
        }))}
        sourceId="dcceew-battery-program"
        footnote={`Program effective from ${formatDate(batteryProgram.effectiveFrom)}; dataset checked ${formatDate(batteryProgram.checkedAt)}.`}
      />

      <h2 id="dollar-value">Turning STCs into dollars</h2>
      <p>
        Each STC has a market value that moves over time and is influenced by your installer&apos;s
        arrangement. That&apos;s why our estimator shows your STC count first and only converts to
        dollars if you enter a certificate price. Try it in the{" "}
        <a href="/calculators/battery-discount-estimator">battery discount estimator</a>.
      </p>

      <Callout tone="warning" title="Unofficial — confirm your entitlement">
        This is a plain-language explainer, not an official calculation. Confirm your actual STC
        entitlement with the{" "}
        <a href={batteryProgram.recRegistryUrl} target="_blank" rel="noopener noreferrer">
          REC Registry calculator
        </a>{" "}
        and your accredited installer.
      </Callout>
    </ArticleLayout>
  );
}
