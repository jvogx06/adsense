import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { RoofReplacementCalculator } from "@/components/calculator/tools/RoofReplacementCalculator";
import { DataTable } from "@/components/content/DataTable";
import { Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/renovations/roof-replacement-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/renovations/roof-replacement-cost"
      breadcrumbs={[
        { name: "Renovations", href: "/renovations" },
        { name: "Roof Replacement Cost", href: "/renovations/roof-replacement-cost" },
      ]}
      answer={
        <p>
          Roof replacement is commonly priced per square metre by material. A cited guide
          lists Colorbond/metal around A$18–37/m², concrete/asphalt A$40–60/m², terracotta
          A$80–120/m² and slate A$200–500/m². Multiply by your roof area for a range — and
          confirm whether a quote is material-only or fully installed.
        </p>
      }
      related={[
        { label: "Roof restoration cost", href: "/renovations/roof-restoration-cost" },
        { label: "Home renovation budget calculator", href: "/calculators/home-renovation-budget" },
        { label: "Renovation costs hub", href: "/renovations" },
      ]}
    >
      <h2 id="material-table">Material ranges ($/m²)</h2>
      <DataTable
        caption="Roof replacement per-m² ranges by material (cited guide)"
        columns={[
          { key: "material", header: "Material" },
          { key: "range", header: "Per m²", numeric: true },
        ]}
        rows={[
          { material: "Colorbond / metal", range: "A$18–A$37" },
          { material: "Concrete / asphalt", range: "A$40–A$60" },
          { material: "Terracotta tile", range: "A$80–A$120" },
          { material: "Slate", range: "A$200–A$500" },
        ]}
        sourceId="hipages-roof-replacement-2026"
        footnote="Confirm whether each range is material-only or installed; do not mix with restoration or repair figures."
      />

      <h2 id="estimator">Area estimator</h2>
      <p>
        Enter your roof area and material to get a source-based range. The estimator uses the
        exact dated $/m² band for each material and never blends scopes.
      </p>
      <div className="my-6">
        <RoofReplacementCalculator />
      </div>

      <Callout tone="warning" title="Scope matters">
        &ldquo;Material only&rdquo;, &ldquo;reroof&rdquo; and &ldquo;installed new roof&rdquo;
        are different scopes. Each dataset record labels exactly what its range represents.
        Removal/disposal and structural repair are usually extra unless quoted.
      </Callout>
    </ArticleLayout>
  );
}
