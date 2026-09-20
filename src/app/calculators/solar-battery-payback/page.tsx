import type { Metadata } from "next";
import { CalculatorPageLayout } from "@/components/templates/CalculatorPageLayout";
import { SolarBatteryPaybackCalculator } from "@/components/calculator/tools/SolarBatteryPaybackCalculator";
import { Definition } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/calculators/solar-battery-payback");

export default function Page() {
  return (
    <CalculatorPageLayout
      slug="/calculators/solar-battery-payback"
      breadcrumbs={[
        { name: "Calculators", href: "/calculators" },
        { name: "Solar Battery Payback", href: "/calculators/solar-battery-payback" },
      ]}
      intro="Model simple battery payback and 10-year savings using your installed cost, usable capacity, solar surplus, electricity tariffs and efficiency assumptions."
      tool={<SolarBatteryPaybackCalculator />}
      related={[
        { label: "Solar battery cost in Australia", href: "/solar-batteries/solar-battery-cost" },
        { label: "Cheaper Home Batteries Program", href: "/solar-batteries/federal-battery-program" },
        { label: "Federal battery discount estimator", href: "/calculators/battery-discount-estimator" },
        { label: "Solar system size calculator", href: "/calculators/solar-system-size" },
      ]}
    >
      <h2 id="how-it-works">How payback is modelled</h2>
      <p>
        Each year the model charges the battery from your spare solar, delivers that
        stored energy to your overnight load, and values it against your tariffs:
      </p>
      <ul>
        <li>Charge input = the lesser of your solar surplus and the battery&apos;s usable capacity ÷ round-trip efficiency.</li>
        <li>Delivered energy = the lesser of your overnight load and charge input × efficiency.</li>
        <li>Avoided import = delivered × import rate × 365 days.</li>
        <li>Forgone export = charge input × feed-in rate × 365 days.</li>
        <li>Net yearly saving = avoided import − forgone export + any VPP benefit.</li>
      </ul>
      <p>
        Usable capacity shrinks each year by the degradation you enter, and savings
        accumulate until they reach your installed cost.
      </p>

      <Definition term="Why payback can be &ldquo;never&rdquo;">
        If your feed-in tariff is close to or higher than your import tariff, storing
        energy instead of exporting it can save little or nothing. The model reports
        this honestly rather than forcing a payback number.
      </Definition>

      <h2 id="not-included">What this does not include</h2>
      <p>
        Financing/interest, future tariff changes, maintenance and future rebate
        changes are excluded unless you build them into your inputs. Results are a
        model, not a quote or a savings guarantee.
      </p>

      <h2 id="improve">How to improve the estimate</h2>
      <p>
        Use your real import and feed-in rates from your bill, a realistic overnight
        load, and the manufacturer&apos;s usable capacity and round-trip efficiency.
        Try a few scenarios rather than trusting one national payback claim.
      </p>
    </CalculatorPageLayout>
  );
}
