import type { Metadata } from "next";
import { CalculatorPageLayout } from "@/components/templates/CalculatorPageLayout";
import { BatteryDiscountCalculator } from "@/components/calculator/tools/BatteryDiscountCalculator";
import { UpdateNotice } from "@/components/content/callouts";
import { batteryProgram } from "@/data/programs/battery-program";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/calculators/battery-discount-estimator");

export default function Page() {
  return (
    <CalculatorPageLayout
      slug="/calculators/battery-discount-estimator"
      breadcrumbs={[
        { name: "Calculators", href: "/calculators" },
        { name: "Federal Battery Discount Estimator", href: "/calculators/battery-discount-estimator" },
      ]}
      intro="A rough, dated indicative estimate of the federal battery discount on an eligible quote. This is not an official government calculator."
      tool={<BatteryDiscountCalculator />}
      related={[
        { label: "Cheaper Home Batteries Program explained", href: "/solar-batteries/federal-battery-program" },
        { label: "Solar battery payback calculator", href: "/calculators/solar-battery-payback" },
        { label: "Solar battery cost in Australia", href: "/solar-batteries/solar-battery-cost" },
      ]}
    >
      <UpdateNotice effectiveFrom={batteryProgram.effectiveFrom}>
        <p>
          This estimator reads a dated program dataset — it never hard-codes a
          permanent percentage. The current indicative figure is{" "}
          <strong>{batteryProgram.headlineSupport}</strong>, and support declines over
          time until 2030. Always confirm your exact entitlement with DCCEEW and your
          installer.
        </p>
      </UpdateNotice>

      <h2 id="how-it-works">How the estimate works</h2>
      <p>
        In indicative mode we apply the program&apos;s dated headline percentage to
        your eligible installed quote to give a rough discount and net cost. In manual
        mode you enter the discount you were actually quoted and we simply show the net.
        Eligibility is checked against the dataset&apos;s capacity band.
      </p>
      <h2 id="limits">Important limits</h2>
      <p>
        The real discount depends on the current STC-style formula, certificate prices
        and your installer&apos;s pricing, so treat this as a ballpark only. The
        program&apos;s effective date and official source appear next to your result.
      </p>
    </CalculatorPageLayout>
  );
}
