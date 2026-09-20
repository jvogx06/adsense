import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/editorial-policy");

export default function Page() {
  return (
    <TrustLayout
      slug="/editorial-policy"
      breadcrumbs={[{ name: "Editorial Policy", href: "/editorial-policy" }]}
      lead="How we research, write and correct our content — and how advertising is kept separate from editorial conclusions."
    >
      <h2 id="mission">Original, utility-first research</h2>
      <p>
        Our goal is to help you make a decision or run a calculation. We build original tools,
        source-normalised tables and transparent methodology rather than paraphrasing other sites.
      </p>

      <h2 id="sourcing">Sourcing standard</h2>
      <p>
        Every published market figure is tied to a dated source in our{" "}
        <a href="/sources">source registry</a>, prioritising government and regulator sources over
        commercial ones. We preserve each source&apos;s scope and wording and never blend conflicting
        scopes into a fabricated average.
      </p>

      <h2 id="ai">AI and automation</h2>
      <p>
        Automated tools may help structure drafts or check consistency, but published figures must be
        linked to the listed sources, and calculator logic is written and unit-tested by hand. We do
        not mass-generate low-value pages.
      </p>

      <h2 id="reviews">No fake reviews or paid rankings</h2>
      <p>
        We do not publish fake reviews, invented testimonials or paid rankings, and we never claim
        &ldquo;expert reviewed&rdquo; unless a named, real reviewer has reviewed that page. If we
        engage a qualified reviewer in future, their real details and a <code>reviewedBy</code> credit
        will appear only on pages they actually reviewed.
      </p>

      <h2 id="independence">Advertising independence</h2>
      <p>
        Advertising helps fund the site but does not determine our editorial conclusions. Advertisers
        do not write or approve our guides. See our{" "}
        <a href="/advertising-disclosure">advertising disclosure</a>.
      </p>

      <h2 id="corrections">Corrections & updates</h2>
      <p>
        We fix errors promptly and update figures on a review cadence (rebates and programs most
        frequently). See our <a href="/corrections">corrections policy</a> and{" "}
        <a href="/methodology">methodology</a>.
      </p>

      <h2 id="affiliate">Affiliate policy (reserved for the future)</h2>
      <p>
        We currently run display advertising only. If affiliate or sponsored relationships are added
        later, they will be clearly labelled and this policy updated — we will not present paid
        placements as neutral recommendations.
      </p>
    </TrustLayout>
  );
}
