import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { DataTable } from "@/components/content/DataTable";
import { Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/trades/switchboard-upgrade-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/trades/switchboard-upgrade-cost"
      breadcrumbs={[
        { name: "Tradie Costs", href: "/trades" },
        { name: "Switchboard Upgrade Cost", href: "/trades/switchboard-upgrade-cost" },
      ]}
      answer={
        <p>
          A cited 2026 guide puts a typical installed 12-pole switchboard replacement around
          A$900–A$1,200. Hardware alone is less (a 160A board around A$300–A$600), while
          higher-capacity units and jobs needing extra cabling or rewiring can move the
          project toward A$2,000–A$2,500. These are different scopes, kept separate below.
        </p>
      }
      related={[
        { label: "Electrician cost", href: "/trades/electrician-cost" },
        { label: "Air conditioning repair cost", href: "/air-conditioning/air-conditioning-repair-cost" },
        { label: "Tradie costs hub", href: "/trades" },
      ]}
    >
      <h2 id="scopes">Cost by scope (sourced)</h2>
      <p>
        Switchboard figures mean very different things depending on scope. We keep them
        separate rather than blending them into one number:
      </p>
      <DataTable
        caption="Switchboard cost by scope (2026 national guide)"
        columns={[
          { key: "scope", header: "Scope" },
          { key: "range", header: "Cited figure", numeric: true },
          { key: "note", header: "What it means" },
        ]}
        rows={[
          { scope: "160A board — hardware", range: "A$300–A$600", note: "Unit only, excludes installation" },
          { scope: "250A unit — hardware", range: "up to A$2,000", note: "Higher-capacity unit, excludes installation" },
          { scope: "Installed 12-pole replacement", range: "A$900–A$1,200", note: "Board plus typical installation" },
          { scope: "With extra cabling/rewiring", range: "A$2,000–A$2,500", note: "Larger project scope" },
        ]}
        sourceId="hipages-switchboard-2026"
        footnote="Hardware, installed replacement and rewiring are different scopes — do not add them together or average them."
      />

      <div className="my-6 grid gap-4 sm:grid-cols-2">
        <CostRangeCard datumId="switchboard-installed-12pole" />
        <CostRangeCard datumId="switchboard-rewiring-project" />
      </div>

      <h2 id="variables">What drives the cost</h2>
      <ul>
        <li>Whether the board is replaced or just modified.</li>
        <li>Number of circuits and safety switches added.</li>
        <li>Condition and age of existing wiring.</li>
        <li>Whether capacity (supply) needs increasing.</li>
        <li>Access and whether temporary disconnection is required.</li>
      </ul>

      <h2 id="labour">Labour reference</h2>
      <p>For hourly labour context, our electrician cost guide lists sourced rates:</p>
      <div className="my-6">
        <CostRangeCard datumId="electrician-hourly" />
      </div>

      <Callout tone="warning" title="Licensed work only">
        Switchboard work is licensed electrical work. Always use a licensed electrician and
        confirm the compliance certificate.
      </Callout>
    </ArticleLayout>
  );
}
