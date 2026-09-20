import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { DataTable } from "@/components/content/DataTable";
import { RenovationBudgetCalculator } from "@/components/calculator/tools/RenovationBudgetCalculator";
import { Checklist, Callout } from "@/components/content/callouts";
import { SourceBadge } from "@/components/content/sources";
import { formatAUDRange } from "@/lib/format";
import { requireCostDatum } from "@/data/costs/index";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/renovations/bathroom-renovation-cost");

export default function Page() {
  const overall = requireCostDatum("bathroom-reno-overall");
  return (
    <ArticleLayout
      slug="/renovations/bathroom-renovation-cost"
      breadcrumbs={[
        { name: "Renovations", href: "/renovations" },
        { name: "Bathroom Renovation Cost", href: "/renovations/bathroom-renovation-cost" },
      ]}
      answer={
        <>
          <p>
            A cited 2026 Australian guide places bathroom renovations broadly around{" "}
            {formatAUDRange(overall.low, overall.high)}, with budget A$8k–15k, standard
            A$15k–35k and premium work above that. Your actual quote can move materially with
            size, plumbing changes, waterproofing, finishes and location.
          </p>
          <div className="mt-2">
            <SourceBadge sourceId="hipages-bathroom-2026" />
          </div>
        </>
      }
      related={[
        { label: "Home renovation budget calculator", href: "/calculators/home-renovation-budget" },
        { label: "Kitchen renovation cost", href: "/renovations/kitchen-renovation-cost" },
        { label: "Plumber cost", href: "/trades/plumber-cost" },
        { label: "Electrician cost", href: "/trades/electrician-cost" },
      ]}
    >
      <h2 id="tiers">Cost tiers</h2>
      <p>
        The same source groups projects into tiers. These are the source&apos;s semantic
        labels, not midpoints presented as averages:
      </p>
      <DataTable
        caption="Bathroom renovation tiers (national guide)"
        columns={[
          { key: "tier", header: "Tier" },
          { key: "range", header: "Range", numeric: true },
          { key: "note", header: "Typical scope" },
        ]}
        rows={[
          { tier: "Budget", range: "A$8,000–A$15,000", note: "Basic finishes, like-for-like fixtures" },
          { tier: "Standard", range: "A$15,000–A$35,000", note: "Mid-range finishes, new fixtures & tiling" },
          { tier: "Premium", range: "A$35,000+", note: "Premium finishes, custom joinery" },
        ]}
        sourceId="hipages-bathroom-2026"
        footnote="Ranges are from a commercial marketplace guide; treat as one dated reference, not a quote."
      />

      <h2 id="includes">What the number includes</h2>
      <p>
        Published ranges like this don&apos;t always itemise GST, and scope varies. Confirm
        with each quote whether it includes demolition, waterproofing, tiling, fixtures,
        plumbing/electrical, cabinetry and labour — the source does not break these out, so
        we don&apos;t fabricate component percentages.
      </p>

      <h2 id="breakdown">Cost breakdown (components, not fabricated percentages)</h2>
      <ul>
        <li>Demolition and rubbish removal.</li>
        <li>Waterproofing (critical and regulated).</li>
        <li>Tiling — often a large share, driven by area and tile choice.</li>
        <li>Fixtures and tapware.</li>
        <li>Plumbing and electrical (licensed work).</li>
        <li>Cabinetry/vanity.</li>
        <li>Labour and project management.</li>
      </ul>

      <h2 id="worksheet">Build your bathroom budget</h2>
      <p>
        Enter your own low/base/high figures for each line. This worksheet doesn&apos;t
        insert market prices — it helps you structure a realistic budget with a contingency.
      </p>
      <div className="my-6">
        <RenovationBudgetCalculator preset="bathroom" />
      </div>

      <h2 id="push-up">What can push the quote up?</h2>
      <ul>
        <li>Moving plumbing or changing the layout.</li>
        <li>Waterproofing/structural issues found after demolition.</li>
        <li>Premium tiles, tapware or custom joinery.</li>
        <li>Difficult access or upper-storey bathrooms.</li>
      </ul>

      <Checklist
        title="Questions to ask before comparing quotes"
        items={[
          "Is the scope (layout, fixtures, tiling area) identical?",
          "Is waterproofing to standard included and certified?",
          "Are demolition, disposal and make-good included?",
          "How are variations priced if issues are found?",
          "What warranty applies to the work?",
        ]}
      />

      <h2 id="licensed">When a licensed professional is required</h2>
      <Callout tone="warning" title="Licensed work">
        Plumbing and electrical work must be carried out by licensed tradespeople, and
        waterproofing has regulated standards. Do not attempt regulated work yourself.
        Confirm current licensing requirements with your state regulator before making any
        legal claims about who can do what.
      </Callout>

      <div className="my-6">
        <CostRangeCard datumId="bathroom-reno-overall" />
      </div>
    </ArticleLayout>
  );
}
