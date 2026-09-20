import type { Metadata } from "next";
import { CalculatorPageLayout } from "@/components/templates/CalculatorPageLayout";
import { AirConditionerCalculator } from "@/components/calculator/tools/AirConditionerCalculator";
import { Callout, Definition } from "@/components/content/callouts";
import { acWorkedExamples, computeAcExample } from "@/lib/calculators/examples";
import { formatAUD, formatKWh } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/calculators/air-conditioner-running-cost");

export default function Page() {
  return (
    <CalculatorPageLayout
      slug="/calculators/air-conditioner-running-cost"
      breadcrumbs={[
        { name: "Calculators", href: "/calculators" },
        { name: "Air Conditioner Running Cost", href: "/calculators/air-conditioner-running-cost" },
      ]}
      intro="Estimate what your air conditioner could cost per day, month and year using your own power rating, usage and electricity tariff."
      tool={<AirConditionerCalculator />}
      related={[
        { label: "Ducted air conditioning cost", href: "/air-conditioning/ducted-air-conditioning-cost", description: "Upfront and running costs for ducted systems." },
        { label: "Split system installation cost", href: "/air-conditioning/split-system-installation-cost" },
        { label: "Ducted vs split comparison", href: "/air-conditioning/ducted-vs-split-system" },
        { label: "Electricity usage calculator", href: "/calculators/electricity-usage" },
      ]}
    >
      <h2 id="how-it-works">How the calculation works</h2>
      <p>
        The calculator uses a simple, transparent formula. When you know the
        electrical input power in kilowatts (kW), energy use is just power times
        runtime:
      </p>
      <ul>
        <li><strong>Energy (kWh) = input power (kW) × hours run</strong></li>
        <li><strong>Cost = energy (kWh) × tariff (converted from c/kWh to A$/kWh)</strong></li>
      </ul>
      <p>
        If you only know the cooling capacity and an efficiency ratio (EER or COP),
        the estimated input power is <strong>capacity ÷ efficiency ratio</strong>.
        Tariffs are entered in cents per kWh and converted internally by dividing
        by 100.
      </p>

      <Definition term="Input power vs cooling capacity">
        Input power is the electricity the unit draws. Cooling capacity is how much
        cooling it delivers. A reverse-cycle unit with 7 kW cooling and a COP of 3
        draws roughly 2.3 kW of electricity at full load.
      </Definition>

      <h2 id="assumptions">Assumptions</h2>
      <p>
        Defaults in this tool are clearly labelled assumptions, not facts. In simple
        mode we assume the unit runs at its stated input power for the hours you
        enter. In advanced mode you can add a load factor (the compressor rarely
        draws full power the whole time), standby energy and weeks per year.
      </p>

      <h2 id="not-included">What this does not include</h2>
      <p>
        This estimate covers electricity to run the unit only. It does not include
        purchase, installation, servicing or repairs, and it does not model your
        exact thermostat behaviour, outdoor temperature, insulation or inverter
        modulation.
      </p>

      <h2 id="examples">Worked examples</h2>
      <p>
        These are illustrative examples using labelled assumptions, not market claims.
        They are computed with the same formula as the calculator above:
      </p>
      <ul>
        {acWorkedExamples.map((ex) => {
          const r = computeAcExample(ex);
          return (
            <li key={ex.label}>
              <strong>{ex.label}:</strong> {ex.input.ratedInputKW} kW input,{" "}
              {ex.input.hoursPerDay} hours/day, {ex.input.tariffCents} c/kWh → about{" "}
              {formatKWh(r.kWhPerDay)}/day and approximately{" "}
              {formatAUD(r.costPerDay, { forceDecimals: true })}/day while operating.
            </li>
          );
        })}
      </ul>

      <h2 id="improve">How to improve the estimate</h2>
      <p>
        Read your unit&apos;s input power from the compliance plate or manual, use
        your actual usage tariff (check your bill), and in advanced mode set a load
        factor below 1 to reflect inverter modulation. Tariff is user-supplied, so
        this tool never assumes a national electricity rate.
      </p>

      <Callout tone="info" title="Why a calculator, not a single number">
        A single &ldquo;average&rdquo; running cost hides the two things that matter
        most — your unit&apos;s power draw and your tariff. Entering your own numbers
        gives a far more useful estimate.
      </Callout>
    </CalculatorPageLayout>
  );
}
