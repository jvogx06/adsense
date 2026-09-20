import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/solar-batteries/solar-battery-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/solar-batteries/solar-battery-cost"
      breadcrumbs={[
        { name: "Solar & Batteries", href: "/solar-batteries" },
        { name: "Solar Battery Cost", href: "/solar-batteries/solar-battery-cost" },
      ]}
      answer={
        <p>
          A cited May 2026 specialist guide places home battery hardware roughly between
          A$4,000 and A$13,000+ depending on storage size and brand, before installation
          and any rebate. Your real cost depends on capacity, installation and the federal
          program — so treat this as market context, not a quote.
        </p>
      }
      related={[
        { label: "Solar battery payback calculator", href: "/calculators/solar-battery-payback" },
        { label: "Cheaper Home Batteries Program", href: "/solar-batteries/federal-battery-program" },
        { label: "Battery discount estimator", href: "/calculators/battery-discount-estimator" },
        { label: "Solar panel installation cost", href: "/solar-batteries/solar-panel-installation-cost" },
      ]}
    >
      <h2 id="market-context">Market context</h2>
      <p>
        Battery pricing depends heavily on usable capacity (kWh) and brand. The dated
        range below is hardware context from a specialist publisher — it excludes
        installation and rebates, which move your net cost significantly.
      </p>
      <div className="my-6">
        <CostRangeCard datumId="solar-battery-hardware" />
      </div>

      <h2 id="components">What makes up your real cost</h2>
      <p>Your installed cost typically includes:</p>
      <ul>
        <li>The battery hardware (the range above).</li>
        <li>Installation labour and any electrical/switchboard work.</li>
        <li>An inverter or hybrid inverter, if not already present.</li>
        <li>Then <em>minus</em> any federal program support you&apos;re eligible for.</li>
      </ul>

      <h2 id="rebate">Rebate context</h2>
      <p>
        The federal{" "}
        <a href="/solar-batteries/federal-battery-program">Cheaper Home Batteries Program</a>{" "}
        can reduce the upfront cost for eligible systems. Estimate the effect with the{" "}
        <a href="/calculators/battery-discount-estimator">battery discount estimator</a>{" "}
        (indicative only).
      </p>

      <h2 id="worth-it">Is it worth it?</h2>
      <p>
        Whether a battery pays off is a separate question from its price. Model it with
        the <a href="/calculators/solar-battery-payback">payback calculator</a> using your
        own tariffs and solar surplus.
      </p>

      <Callout tone="warning" title="Different scopes, kept separate">
        We show the hardware range with its exact scope and date rather than blending it
        with installed-cost figures from other sources to invent a single &ldquo;average&rdquo;.
      </Callout>
    </ArticleLayout>
  );
}
