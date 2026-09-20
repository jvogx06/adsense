import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { Checklist, Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/trades/electrician-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/trades/electrician-cost"
      breadcrumbs={[
        { name: "Tradie Costs", href: "/trades" },
        { name: "Electrician Cost", href: "/trades/electrician-cost" },
      ]}
      answer={
        <p>
          A cited 2026 national guide lists electrician rates of about A$80–100 per hour,
          with a service/call-out fee around A$80–130. What you pay depends on the job,
          materials, access and whether it&apos;s after hours.
        </p>
      }
      related={[
        { label: "Plumber cost", href: "/trades/plumber-cost" },
        { label: "Switchboard upgrade cost", href: "/trades/switchboard-upgrade-cost" },
        { label: "Air conditioning repair cost", href: "/air-conditioning/air-conditioning-repair-cost" },
      ]}
    >
      <h2 id="ranges">Sourced ranges</h2>
      <div className="my-6 grid gap-4 sm:grid-cols-2">
        <CostRangeCard datumId="electrician-hourly" />
        <CostRangeCard datumId="electrician-service-fee" />
      </div>

      <h2 id="factors">What affects the final quote</h2>
      <ul>
        <li>Job type and time required.</li>
        <li>Materials (cabling, fittings, safety switches).</li>
        <li>Access and whether the switchboard needs work.</li>
        <li>Emergency or after-hours attendance.</li>
      </ul>

      <Checklist
        title="Comparing electrical quotes"
        items={[
          "Is the service fee separate from hourly labour?",
          "Are materials included?",
          "Is a switchboard upgrade needed for the work?",
          "What warranty and compliance certificate is provided?",
        ]}
      />

      <Callout tone="warning" title="Licensed work only">
        Electrical work must be carried out by a licensed electrician. Never attempt DIY
        electrical work. Confirm current licensing requirements with your state regulator.
      </Callout>
    </ArticleLayout>
  );
}
