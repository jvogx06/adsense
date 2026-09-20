import type { Metadata } from "next";
import { CalculatorPageLayout } from "@/components/templates/CalculatorPageLayout";
import { PoolRunningCalculator } from "@/components/calculator/tools/PoolRunningCalculator";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/calculators/pool-running-cost");

export default function Page() {
  return (
    <CalculatorPageLayout
      slug="/calculators/pool-running-cost"
      breadcrumbs={[
        { name: "Calculators", href: "/calculators" },
        { name: "Pool Running Cost", href: "/calculators/pool-running-cost" },
      ]}
      intro="Estimate what your pool pump — and optional heater — cost to run each year from your equipment ratings, schedule and tariff."
      tool={<PoolRunningCalculator />}
      related={[
        { label: "Electricity usage calculator", href: "/calculators/electricity-usage" },
        { label: "Air conditioner running cost", href: "/calculators/air-conditioner-running-cost" },
        { label: "Solar system size calculator", href: "/calculators/solar-system-size" },
      ]}
    >
      <h2 id="how-it-works">How the calculation works</h2>
      <p>
        Pump cost = <strong>pump kW × hours/day × days/year × tariff</strong>. For a
        heat-pump heater, the electrical input is the thermal output divided by the
        COP, then multiplied by its own hours and days.
      </p>
      <h2 id="notes">Why real costs vary</h2>
      <p>
        Variable-speed pumps draw far less on low speed, and seasonal schedules change
        run hours substantially. Enter a realistic average schedule, and try low and
        high scenarios to bracket the result.
      </p>
    </CalculatorPageLayout>
  );
}
