import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { DataTable } from "@/components/content/DataTable";
import { Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/solar-batteries/tariffs-and-battery-payback");

export default function Page() {
  return (
    <ArticleLayout
      slug="/solar-batteries/tariffs-and-battery-payback"
      breadcrumbs={[
        { name: "Solar & Batteries", href: "/solar-batteries" },
        { name: "Tariffs & Battery Payback", href: "/solar-batteries/tariffs-and-battery-payback" },
      ]}
      dataChecked={false}
      answer={
        <p>
          The value of a home battery is mostly the gap between what you pay to{" "}
          <strong>import</strong> electricity and what you earn to <strong>export</strong> it
          (feed-in). Storing solar to use at night avoids the import price but forgoes the
          feed-in you&apos;d have earned — so the bigger that gap, the better a battery pays. If
          feed-in is close to (or above) import, storage saves little.
        </p>
      }
      related={[
        { label: "Solar battery payback calculator", href: "/calculators/solar-battery-payback", description: "Model your own import/feed-in tariffs." },
        { label: "Usable capacity explained", href: "/solar-batteries/usable-capacity-explained" },
        { label: "Solar battery cost in Australia", href: "/solar-batteries/solar-battery-cost" },
        { label: "Federal battery program", href: "/solar-batteries/federal-battery-program" },
      ]}
    >
      <h2 id="the-gap">Why the import–feed-in gap drives payback</h2>
      <p>
        Every kWh you shift into the battery and use later:
      </p>
      <ul>
        <li><strong>saves</strong> you the import price you would otherwise pay, but</li>
        <li><strong>costs</strong> you the feed-in tariff you would otherwise have earned by exporting it.</li>
      </ul>
      <p>
        So the net benefit per kWh is roughly <strong>import rate − feed-in rate</strong> (less
        round-trip losses). The calculator applies exactly this, honestly handling the case
        where feed-in exceeds import.
      </p>

      <h2 id="scenarios">Illustrative scenarios</h2>
      <p>
        These are qualitative scenarios to model in the calculator with your own numbers — not
        sourced market rates:
      </p>
      <DataTable
        caption="How the import–feed-in gap changes the picture (illustrative)"
        columns={[
          { key: "gap", header: "Import vs feed-in" },
          { key: "effect", header: "Effect on battery value" },
        ]}
        rows={[
          { gap: "Large gap (high import, low feed-in)", effect: "Storing solar for night use pays best." },
          { gap: "Small gap", effect: "Modest benefit; payback is longer." },
          { gap: "Feed-in ≥ import", effect: "Exporting can beat storing; the model may show little/no payback." },
        ]}
        footnote="Enter your own tariffs in the calculator; time-of-use tariffs can change this materially."
      />

      <h2 id="tou">Time-of-use tariffs</h2>
      <p>
        On a time-of-use plan the &ldquo;import&rdquo; price varies by time of day, so charging
        cheaply and using during peak periods can add value beyond solar shifting. Model your
        peak import rate in the{" "}
        <a href="/calculators/solar-battery-payback">payback calculator</a> to see the effect.
      </p>

      <Callout tone="info" title="Estimate, not a quote">
        Payback depends on your tariffs, solar surplus, overnight load and installed cost.
        Model several scenarios rather than relying on one national payback figure.
      </Callout>
    </ArticleLayout>
  );
}
