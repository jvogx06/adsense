import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { Checklist } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/renovations/whole-home-renovation-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/renovations/whole-home-renovation-cost"
      breadcrumbs={[
        { name: "Renovations", href: "/renovations" },
        { name: "Whole-Home Renovation Cost", href: "/renovations/whole-home-renovation-cost" },
      ]}
      answer={
        <p>
          Larger whole-home renovations vary enormously with scope. A cited national guide
          puts bigger projects roughly in the A$100,000–A$300,000+ range — context only, not a
          quote. The reliable path is a line-item budget built from your own scope.
        </p>
      }
      related={[
        { label: "Home renovation budget calculator", href: "/calculators/home-renovation-budget" },
        { label: "Bathroom renovation cost", href: "/renovations/bathroom-renovation-cost" },
        { label: "Kitchen renovation cost", href: "/renovations/kitchen-renovation-cost" },
        { label: "Roof replacement cost", href: "/renovations/roof-replacement-cost" },
      ]}
    >
      <h2 id="context">Context range</h2>
      <div className="my-6">
        <CostRangeCard datumId="whole-home-reno-context" />
      </div>

      <h2 id="plan">Plan it line by line</h2>
      <p>
        Whole-home projects are the sum of many decisions. Build a budget from individual
        rooms and works using the{" "}
        <a href="/calculators/home-renovation-budget">renovation budget calculator</a>, then
        add a contingency for the unknowns that big projects always surface.
      </p>

      <h2 id="why-vary">Why quotes vary so much</h2>
      <ul>
        <li>Structural changes and extensions vs cosmetic updates.</li>
        <li>Services (plumbing, electrical, gas) relocation.</li>
        <li>Approvals, engineering and access.</li>
        <li>Hidden conditions: asbestos, rot, non-compliant wiring.</li>
      </ul>

      <Checklist
        title="Before you commit"
        items={[
          "Lock the scope and get like-for-like quotes.",
          "Budget a contingency of 10–20% for unknowns.",
          "Confirm who manages approvals and engineering.",
          "Agree how variations are priced in writing.",
        ]}
      />
    </ArticleLayout>
  );
}
