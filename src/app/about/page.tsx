import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/about");

export default function Page() {
  return (
    <TrustLayout
      slug="/about"
      breadcrumbs={[{ name: "About", href: "/about" }]}
      lead={`${siteConfig.siteName} is an independent Australian information site about what homes cost to run, repair and improve.`}
    >
      <h2 id="mission">Our mission</h2>
      <p>
        We help Australian homeowners answer practical &ldquo;how much&rdquo; questions with
        calculators and cost guides built from dated, cited sources. We&apos;d rather publish a
        useful, honest page than an inflated one.
      </p>

      <h2 id="how">How we work</h2>
      <ul>
        <li>Every market figure traces to a source with a date (see <a href="/sources">Sources</a>).</li>
        <li>Calculators run in your browser from your inputs, with visible formulas.</li>
        <li>We preserve each source&apos;s scope and never invent numbers to fill space.</li>
      </ul>

      <h2 id="independence">Independence & honesty</h2>
      <p>
        We are an independent information site — not a government service, and not a marketplace or
        directory. We do not have fake team members, invented credentials, or endorsements we
        haven&apos;t earned. Content is produced by our editorial team; where a qualified reviewer
        contributes in future, we&apos;ll credit them by name on the pages they review.
      </p>

      <h2 id="funding">How the site is funded</h2>
      <p>
        The site is supported by display advertising, kept clearly separate from our editorial
        conclusions. See our <a href="/advertising-disclosure">advertising disclosure</a> and{" "}
        <a href="/editorial-policy">editorial policy</a>.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions or corrections? See <a href="/contact">Contact</a> and our{" "}
        <a href="/corrections">corrections policy</a>.
      </p>
    </TrustLayout>
  );
}
