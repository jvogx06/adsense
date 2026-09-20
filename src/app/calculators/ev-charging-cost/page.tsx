import type { Metadata } from "next";
import { CalculatorPageLayout } from "@/components/templates/CalculatorPageLayout";
import { EvChargingCalculator } from "@/components/calculator/tools/EvChargingCalculator";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/calculators/ev-charging-cost");

export default function Page() {
  return (
    <CalculatorPageLayout
      slug="/calculators/ev-charging-cost"
      breadcrumbs={[
        { name: "Calculators", href: "/calculators" },
        { name: "EV Charging Cost", href: "/calculators/ev-charging-cost" },
      ]}
      intro="Compare home-only, mixed and public-only EV charging costs using your consumption, weekly distance, tariffs and charging losses."
      tool={<EvChargingCalculator />}
      related={[
        { label: "Electricity usage calculator", href: "/calculators/electricity-usage" },
        { label: "Air conditioner running cost", href: "/calculators/air-conditioner-running-cost" },
        { label: "Solar system size calculator", href: "/calculators/solar-system-size" },
      ]}
    >
      <h2 id="how-it-works">How the calculation works</h2>
      <p>
        Energy at the battery is <strong>km/year × consumption ÷ 100</strong>. Because
        charging is not perfectly efficient, grid energy is that figure divided by
        (1 − losses). Your weighted tariff blends home and public rates by the share
        you charge at each, and we also show home-only and public-only scenarios.
      </p>
      <h2 id="not-included">What this does not include</h2>
      <p>
        Real-world efficiency varies with driving style, climate, speed and terrain,
        so this does not imply an exact vehicle efficiency. Subscription fees and
        idle/connection fees at public chargers are not modelled.
      </p>
      <h2 id="improve">How to improve the estimate</h2>
      <p>
        Use your vehicle&apos;s real kWh/100km from the trip computer, your actual home
        tariff, and a realistic public-charging share and rate for your area.
      </p>
    </CalculatorPageLayout>
  );
}
