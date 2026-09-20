import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { Checklist } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/renovations/kitchen-renovation-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/renovations/kitchen-renovation-cost"
      breadcrumbs={[
        { name: "Renovations", href: "/renovations" },
        { name: "Kitchen Renovation Cost", href: "/renovations/kitchen-renovation-cost" },
      ]}
      answer={
        <p>
          A cited national guide gives a kitchen renovation ballpark of around
          A$30,000–A$50,000 for a typical scope. Other sources use different scopes, so we
          keep this figure separate rather than blending it into a single &ldquo;average&rdquo;.
          Your quote depends on cabinetry, benchtops, appliances and layout changes.
        </p>
      }
      related={[
        { label: "Home renovation budget calculator", href: "/calculators/home-renovation-budget" },
        { label: "Bathroom renovation cost", href: "/renovations/bathroom-renovation-cost" },
        { label: "Whole-home renovation cost", href: "/renovations/whole-home-renovation-cost" },
        { label: "Electrician cost", href: "/trades/electrician-cost" },
      ]}
    >
      <h2 id="range">The sourced ballpark</h2>
      <div className="my-6">
        <CostRangeCard datumId="kitchen-reno-ballpark" />
      </div>

      <h2 id="drivers">What changes the cost</h2>
      <ul>
        <li>Cabinetry — flat-pack vs custom joinery.</li>
        <li>Benchtops — laminate vs stone.</li>
        <li>Appliances included in the scope.</li>
        <li>Layout changes and moving plumbing/electrical or gas.</li>
        <li>Flooring, splashback and lighting.</li>
      </ul>

      <h2 id="budget">Plan a realistic budget</h2>
      <p>
        Use the{" "}
        <a href="/calculators/home-renovation-budget">renovation budget calculator</a> to
        set your own low/base/high figures per line item with a contingency, rather than
        trusting a single national number.
      </p>

      <Checklist
        title="Before comparing kitchen quotes"
        items={[
          "Confirm cabinetry material and finish across quotes.",
          "Check whether appliances are supplied or excluded.",
          "Confirm whether layout/services changes are included.",
          "Check benchtop material and edge details.",
        ]}
      />
    </ArticleLayout>
  );
}
