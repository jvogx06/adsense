import type { Metadata } from "next";
import { CalculatorPageLayout } from "@/components/templates/CalculatorPageLayout";
import { SolarSystemSizeCalculator } from "@/components/calculator/tools/SolarSystemSizeCalculator";
import { Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/calculators/solar-system-size");

export default function Page() {
  return (
    <CalculatorPageLayout
      slug="/calculators/solar-system-size"
      breadcrumbs={[
        { name: "Calculators", href: "/calculators" },
        { name: "Solar System Size", href: "/calculators/solar-system-size" },
      ]}
      intro="Estimate the solar system size you need from your daily electricity use, the share you want to offset, your own peak-sun-hours and system losses."
      tool={<SolarSystemSizeCalculator />}
      related={[
        { label: "Solar panel installation cost", href: "/solar-batteries/solar-panel-installation-cost" },
        { label: "Solar battery payback calculator", href: "/calculators/solar-battery-payback" },
        { label: "Solar & battery costs hub", href: "/solar-batteries" },
      ]}
    >
      <h2 id="how-it-works">The formula</h2>
      <p>
        <strong>
          Required DC size (kW) = daily use × offset ÷ (peak-sun-hours × (1 − losses))
        </strong>
      </p>
      <p>
        Peak-sun-hours describe how much usable sun your location gets on an average
        day. We deliberately do not assume a value for your city — enter one for your
        area. Losses account for inverter efficiency, wiring, soiling and temperature.
      </p>
      <Callout tone="warning" title="No invented irradiance">
        Because peak-sun-hours vary widely by location and season, this tool asks you
        to supply the figure rather than fabricating a city default. A local installer
        or a dated public dataset can refine it.
      </Callout>

      <h2 id="improve">How to improve the estimate</h2>
      <p>
        Use your annual electricity use divided by 365 for daily use, pick a realistic
        offset (100% rarely means 100% self-consumption), and confirm peak-sun-hours
        for your postcode with an installer.
      </p>
    </CalculatorPageLayout>
  );
}
