import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
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
          Switchboard upgrade cost depends on the work involved — replacing an old board,
          adding safety switches, rewiring circuits or increasing capacity — so it&apos;s
          quoted per job. We don&apos;t publish a fabricated range here because we don&apos;t
          yet hold a dated source for one; instead, we explain the variables and give a labour
          reference.
        </p>
      }
      related={[
        { label: "Electrician cost", href: "/trades/electrician-cost" },
        { label: "Air conditioning repair cost", href: "/air-conditioning/air-conditioning-repair-cost" },
        { label: "Tradie costs hub", href: "/trades" },
      ]}
    >
      <h2 id="variables">What drives the cost</h2>
      <ul>
        <li>Whether the board is replaced or just modified.</li>
        <li>Number of circuits and safety switches added.</li>
        <li>Condition and age of existing wiring.</li>
        <li>Whether capacity (supply) needs increasing.</li>
        <li>Access and whether temporary disconnection is required.</li>
      </ul>

      <h2 id="labour">Labour reference</h2>
      <p>As a starting point for labour, our electrician cost guide lists sourced rates:</p>
      <div className="my-6">
        <CostRangeCard datumId="electrician-hourly" />
      </div>

      <Callout tone="info" title="Why no headline range yet">
        Consistent with our data policy, we won&apos;t invent a switchboard price range to fill
        the page. When we add a dated source for switchboard upgrades, a source-backed range
        will appear here.
      </Callout>

      <Callout tone="warning" title="Licensed work only">
        Switchboard work is licensed electrical work. Always use a licensed electrician and
        confirm the compliance certificate.
      </Callout>
    </ArticleLayout>
  );
}
