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
      intro="A dated, STC-based estimate of federal battery support from your usable capacity and installation date. This is an unofficial estimate, not an official government calculator."
      tool={<BatteryDiscountCalculator />}
      related={[
        { label: "Cheaper Home Batteries Program explained", href: "/solar-batteries/federal-battery-program" },
        { label: "Solar battery payback calculator", href: "/calculators/solar-battery-payback" },
        { label: "Solar battery cost in Australia", href: "/solar-batteries/solar-battery-cost" },
      ]}
    >
      <UpdateNotice effectiveFrom={batteryProgram.effectiveFrom}>
        <p>
          Support under the Cheaper Home Batteries Program is delivered through
          small-scale technology certificates (STCs), not a flat percentage off your
          quote. This estimator reads a dated program dataset — the STC factor and the
          capacity taper — and never hard-codes a permanent number.
        </p>
      </UpdateNotice>

      <h2 id="how-it-works">How the estimate works</h2>
      <p>The estimate follows the program&apos;s STC design:</p>
      <ol>
        <li>You enter your <strong>usable battery capacity</strong>.</li>
        <li>
          We apply the <strong>capacity taper</strong> — 100% of the STC factor on the
          first 14 kWh, 60% from 14–28 kWh and 15% from 28–50 kWh — and multiply by the
          <strong> STC factor</strong> for your installation date to estimate your STCs.
        </li>
        <li>
          You may optionally enter a <strong>certificate price (A$/STC)</strong>. If you
          do, estimated support = eligible STCs × your price. If not, we show the STC
          count only, because the dollar value depends on the certificate market.
        </li>
      </ol>

      <h2 id="factor">The STC factor declines over time</h2>
      <p>
        The factor steps down through 2030 (6.8 for May–Dec 2026, then 5.7, 5.2, 4.6 and
        so on). Select your installation period in the tool to use the right factor.
      </p>

      <h2 id="target">About the &ldquo;around 30%&rdquo; figure</h2>
      <p>
        The Government describes the program&apos;s approximate target as roughly{" "}
        {batteryProgram.approxProgramTargetPercent}% off eligible battery costs. That is
        explanatory context for the program&apos;s intent — it is <em>not</em> the
        calculator&apos;s formula. Your real result depends on the STC factor, the
        capacity taper and the certificate market.
      </p>

      <h2 id="limits">Important limits</h2>
      <p>
        This is an unofficial estimate. Certificate prices vary and eligibility rules
        can change. Confirm your actual entitlement with the{" "}
        <a href={batteryProgram.recRegistryUrl} target="_blank" rel="noopener noreferrer">
          REC Registry calculator
        </a>{" "}
        and your accredited installer before relying on any figure.
      </p>
    </CalculatorPageLayout>
  );
}
