import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { Callout } from "@/components/content/callouts";
import { reverseCycleExamples, computeAcExample } from "@/lib/calculators/examples";
import { formatAUD, formatKWh } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/air-conditioning/reverse-cycle-running-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/air-conditioning/reverse-cycle-running-cost"
      breadcrumbs={[
        { name: "Air Conditioning", href: "/air-conditioning" },
        { name: "Reverse-Cycle Running Cost", href: "/air-conditioning/reverse-cycle-running-cost" },
      ]}
      dataChecked={false}
      answer={
        <p>
          A reverse-cycle air conditioner&apos;s running cost is its electrical input power
          (kW) multiplied by the hours you run it and your electricity tariff — the same
          whether it&apos;s heating or cooling. Because reverse-cycle systems are efficient
          heaters, running cost depends far more on your unit and tariff than on a single
          national figure. Estimate yours with the calculator below.
        </p>
      }
      related={[
        { label: "Air conditioner running cost calculator", href: "/calculators/air-conditioner-running-cost", description: "Enter your own power, hours and tariff." },
        { label: "How much electricity does air conditioning use?", href: "/air-conditioning/electricity-usage" },
        { label: "Ducted vs split comparison", href: "/air-conditioning/ducted-vs-split-system" },
        { label: "Electricity usage calculator", href: "/calculators/electricity-usage" },
      ]}
    >
      <h2 id="formula">How reverse-cycle running cost works</h2>
      <p>
        Reverse-cycle (heat pump) units move heat rather than generate it, so they use less
        electricity than a resistive heater for the same warmth. The running-cost formula is
        simple:
      </p>
      <ul>
        <li><strong>Energy (kWh) = input power (kW) × hours run</strong></li>
        <li><strong>Cost = energy (kWh) × tariff (c/kWh ÷ 100)</strong></li>
      </ul>
      <p>
        If you only know the heating/cooling capacity and an efficiency ratio (COP/EER), the
        estimated input power is <strong>capacity ÷ efficiency ratio</strong>. The calculator
        handles both.
      </p>

      <h2 id="examples">Worked examples</h2>
      <p>
        Illustrative examples using labelled assumptions (a ~13-week season), computed with
        the same formula as the calculator — not market claims:
      </p>
      <ul>
        {reverseCycleExamples.map((ex) => {
          const r = computeAcExample(ex);
          return (
            <li key={ex.label}>
              <strong>{ex.label}:</strong> {ex.input.ratedInputKW} kW input,{" "}
              {ex.input.hoursPerDay} hours/day, {ex.input.tariffCents} c/kWh → about{" "}
              {formatKWh(r.kWhPerDay)}/day and approximately{" "}
              {formatAUD(r.costPerDay, { forceDecimals: true })}/day while operating (around{" "}
              {formatAUD(r.costPerYear)} across the season).
            </li>
          );
        })}
      </ul>

      <h2 id="drivers">What changes the cost</h2>
      <ul>
        <li>Your unit&apos;s input power and efficiency (COP for heating, EER for cooling).</li>
        <li>Hours of use and thermostat setting.</li>
        <li>Outdoor temperature — heat pumps work harder in extreme cold.</li>
        <li>Insulation, room size and draughts.</li>
        <li>Your electricity tariff (always user-supplied here — no national rate assumed).</li>
      </ul>

      <Callout tone="info" title="Heating vs cooling">
        A reverse-cycle unit is usually cheaper to run for heating than a plug-in electric
        heater of the same warmth, because it moves heat instead of creating it. Compare your
        own scenarios in the calculator rather than relying on one average.
      </Callout>
    </ArticleLayout>
  );
}
