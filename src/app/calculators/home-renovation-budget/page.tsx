import type { Metadata } from "next";
import { CalculatorPageLayout } from "@/components/templates/CalculatorPageLayout";
import { RenovationBudgetCalculator } from "@/components/calculator/tools/RenovationBudgetCalculator";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/calculators/home-renovation-budget");

export default function Page() {
  return (
    <CalculatorPageLayout
      slug="/calculators/home-renovation-budget"
      breadcrumbs={[
        { name: "Calculators", href: "/calculators" },
        { name: "Home Renovation Budget", href: "/calculators/home-renovation-budget" },
      ]}
      intro="Build a line-item renovation budget with a contingency and low, base and high totals — a planning worksheet, not a market-price estimate."
      tool={<RenovationBudgetCalculator />}
      related={[
        { label: "Bathroom renovation cost", href: "/renovations/bathroom-renovation-cost" },
        { label: "Kitchen renovation cost", href: "/renovations/kitchen-renovation-cost" },
        { label: "Whole-home renovation cost", href: "/renovations/whole-home-renovation-cost" },
        { label: "Renovation costs hub", href: "/renovations" },
      ]}
    >
      <h2 id="how-it-works">How the worksheet works</h2>
      <p>
        Enter your own low, base and high figure for each line item. The tool sums
        each column, adds fixed extras (professional fees, permits, temporary
        accommodation) and applies your contingency percentage to produce low, base
        and high totals.
      </p>
      <h2 id="why-worksheet">Why it&apos;s a worksheet, not a price</h2>
      <p>
        We don&apos;t fill in market prices for you, because renovation costs depend
        heavily on scope, finishes, access and location. Use our cost guides to inform
        your figures, then bring them here. A contingency of 10–20% is a common
        planning buffer for unknowns.
      </p>
    </CalculatorPageLayout>
  );
}
