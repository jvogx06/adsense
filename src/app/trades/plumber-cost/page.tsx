import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { Checklist, Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/trades/plumber-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/trades/plumber-cost"
      breadcrumbs={[
        { name: "Tradie Costs", href: "/trades" },
        { name: "Plumber Cost", href: "/trades/plumber-cost" },
      ]}
      answer={
        <p>
          A cited 2026 national guide lists plumber rates of about A$80–200 per hour, with
          call-out fees around A$60–250. The final cost depends on the job, parts, access and
          whether it&apos;s an emergency. Rates and call-outs are usually charged separately.
        </p>
      }
      related={[
        { label: "Electrician cost", href: "/trades/electrician-cost" },
        { label: "Bathroom renovation cost", href: "/renovations/bathroom-renovation-cost" },
        { label: "Tradie costs hub", href: "/trades" },
      ]}
    >
      <h2 id="ranges">Sourced ranges</h2>
      <div className="my-6 grid gap-4 sm:grid-cols-2">
        <CostRangeCard datumId="plumber-hourly" />
        <CostRangeCard datumId="plumber-callout" />
      </div>

      <h2 id="factors">What affects the final quote</h2>
      <ul>
        <li>Job complexity and time on site.</li>
        <li>Parts and fixtures required.</li>
        <li>Access (under-floor, upper storey, tight spaces).</li>
        <li>Emergency or after-hours attendance.</li>
      </ul>

      <h2 id="scenarios">Typical scenarios</h2>
      <p>
        A quick tap repair may be close to a call-out plus a short labour period; a hot-water
        replacement or blocked drain can involve parts, several hours and specialised
        equipment. Ask for a fixed quote where possible so you can compare like for like.
      </p>

      <Checklist
        title="Comparing plumbing quotes"
        items={[
          "Is the call-out fee separate from hourly labour?",
          "Are parts and fixtures included?",
          "Is it a fixed quote or an estimate?",
          "What warranty applies?",
        ]}
      />

      <Callout tone="warning" title="Licensed work">
        Plumbing work must be done by a licensed plumber. Confirm current licensing
        requirements with your state regulator before making legal claims about scope.
      </Callout>
    </ArticleLayout>
  );
}
