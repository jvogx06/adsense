import type { Metadata } from "next";
import { CalculatorPageLayout } from "@/components/templates/CalculatorPageLayout";
import { ElectricityUsageCalculator } from "@/components/calculator/tools/ElectricityUsageCalculator";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/calculators/electricity-usage");

export default function Page() {
  return (
    <CalculatorPageLayout
      slug="/calculators/electricity-usage"
      breadcrumbs={[
        { name: "Calculators", href: "/calculators" },
        { name: "Electricity Usage", href: "/calculators/electricity-usage" },
      ]}
      intro="Add your appliances and see daily, monthly and annual electricity use and cost from power, hours and your tariff."
      tool={<ElectricityUsageCalculator />}
      related={[
        { label: "Air conditioner running cost", href: "/calculators/air-conditioner-running-cost" },
        { label: "Pool running cost", href: "/calculators/pool-running-cost" },
        { label: "EV charging cost", href: "/calculators/ev-charging-cost" },
      ]}
    >
      <h2 id="how-it-works">How the calculation works</h2>
      <p>For each appliance:</p>
      <ul>
        <li><strong>Daily kWh = watts ÷ 1000 × quantity × hours/day</strong></li>
        <li><strong>Weekly kWh = daily kWh × days/week</strong></li>
        <li><strong>Annual kWh = weekly kWh × 52</strong></li>
        <li><strong>Annual cost = annual kWh × tariff</strong> (converted from c/kWh to A$/kWh)</li>
      </ul>
      <p>
        The monthly-equivalent figure is simply the annual cost divided by 12, so it
        averages seasonal variation across the year rather than assuming a fixed 30-day month.
      </p>
      <h2 id="tips">Finding appliance power</h2>
      <p>
        Look for a wattage on the appliance label, compliance plate or manual. For
        appliances that cycle (fridges, heat pumps) the label figure is the running
        draw, not the all-day average, so treat the result as an upper estimate unless
        you adjust the hours.
      </p>
      <h2 id="not-included">What this does not include</h2>
      <p>
        Supply (daily) charges, demand tariffs and time-of-use variations are not
        modelled — this is a usage-cost estimate, not a full bill. No account or
        email is required, and you can print a summary.
      </p>
    </CalculatorPageLayout>
  );
}
