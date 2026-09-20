import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/disclaimer");

export default function Page() {
  return (
    <TrustLayout
      slug="/disclaimer"
      breadcrumbs={[{ name: "Disclaimer", href: "/disclaimer" }]}
      lead="Estimates, not quotes. Please read how to interpret the numbers on this site."
    >
      <h2 id="estimates">Estimates, not quotes</h2>
      <p>
        Every figure and calculator result on this site is an estimate for general information. It is
        not a quote, and it does not account for your specific circumstances. Actual prices depend on
        your property, scope, location, finishes and current market conditions.
      </p>

      <h2 id="assumptions">Assumptions can change</h2>
      <p>
        Calculators rely on the values you enter and clearly labelled default assumptions. Energy
        tariffs, rebate programs, material prices and labour rates change over time, and published
        source ranges carry the date we last checked them.
      </p>

      <h2 id="not-advice">Not professional advice</h2>
      <p>
        Nothing here is financial, legal, electrical, building, engineering or tax advice. Regulated
        work (such as electrical, plumbing and waterproofing) must be carried out by appropriately
        licensed professionals. Confirm licensing and legal requirements with the relevant state
        regulator.
      </p>

      <h2 id="sources">Third-party sources</h2>
      <p>
        We cite third-party sources with their dates. We are not responsible for the content of
        external sites, and third-party estimates (such as SEO or traffic tools) are not official
        figures.
      </p>

      <p>
        See also our <a href="/methodology">methodology</a>, <a href="/terms">terms of use</a> and{" "}
        <a href="/privacy-policy">privacy policy</a>.
      </p>
    </TrustLayout>
  );
}
