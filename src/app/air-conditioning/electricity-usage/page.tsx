import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { Callout } from "@/components/content/callouts";
import { acWorkedExamples, computeAcExample } from "@/lib/calculators/examples";
import { formatAUD, formatKWh } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/air-conditioning/electricity-usage");

export default function Page() {
  return (
    <ArticleLayout
      slug="/air-conditioning/electricity-usage"
      breadcrumbs={[
        { name: "Air Conditioning", href: "/air-conditioning" },
        { name: "Electricity Usage", href: "/air-conditioning/electricity-usage" },
      ]}
      dataChecked={false}
      answer={
        <p>
          How much electricity an air conditioner uses is set by its electrical input power
          (kW) and how long it runs: <strong>kWh = input power × hours</strong>. A small split
          system might use a few kWh a day; a large ducted system running for hours can use
          many times that. The reliable way to know is to use your own unit&apos;s power rating
          — the calculator does exactly that.
        </p>
      }
      related={[
        { label: "Air conditioner running cost calculator", href: "/calculators/air-conditioner-running-cost" },
        { label: "Reverse-cycle running cost", href: "/air-conditioning/reverse-cycle-running-cost" },
        { label: "Electricity usage calculator", href: "/calculators/electricity-usage" },
        { label: "Ducted vs split comparison", href: "/air-conditioning/ducted-vs-split-system" },
      ]}
    >
      <h2 id="how-much">Split vs ducted energy use</h2>
      <p>
        Split systems condition one room; ducted systems condition much more of the home, so
        they draw more power and typically use more energy per hour. These illustrative
        examples are computed with the same tested formula as our calculator (labelled
        assumptions, not market claims):
      </p>
      <ul>
        {acWorkedExamples.map((ex) => {
          const r = computeAcExample(ex);
          return (
            <li key={ex.label}>
              <strong>{ex.label}:</strong> {ex.input.ratedInputKW} kW input,{" "}
              {ex.input.hoursPerDay} hours/day → about {formatKWh(r.kWhPerDay)}/day and{" "}
              {formatKWh(r.kWhPerYear)} across a year of that use (≈{" "}
              {formatAUD(r.costPerYear)} at {ex.input.tariffCents} c/kWh).
            </li>
          );
        })}
      </ul>

      <h2 id="drivers">What drives consumption</h2>
      <ul>
        <li>Input power (kW) — the biggest lever; read it from the compliance plate.</li>
        <li>Runtime hours and thermostat setting.</li>
        <li>Home size, insulation and how many zones/rooms you condition.</li>
        <li>Outdoor conditions and inverter behaviour (units modulate, so full-power hours are rare).</li>
      </ul>

      <h2 id="estimate">Estimate your own usage</h2>
      <p>
        Enter your unit&apos;s input power and hours into the{" "}
        <a href="/calculators/air-conditioner-running-cost">running cost calculator</a> to see
        daily, monthly-equivalent and annual kWh and cost. For a whole-home picture across
        appliances, use the{" "}
        <a href="/calculators/electricity-usage">electricity usage calculator</a>.
      </p>

      <Callout tone="info" title="Why we don't quote a single number">
        &ldquo;Average&rdquo; air-conditioning consumption hides the two things that matter
        most — your unit&apos;s power draw and how long you run it. Your own inputs give a far
        more useful figure.
      </Callout>
    </ArticleLayout>
  );
}
