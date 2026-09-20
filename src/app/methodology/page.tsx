import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/methodology");

export default function Page() {
  return (
    <TrustLayout
      slug="/methodology"
      breadcrumbs={[{ name: "Methodology", href: "/methodology" }]}
      lead="How we collect data, preserve its meaning, run calculators and correct mistakes."
    >
      <h2 id="hierarchy">Our source hierarchy</h2>
      <p>We prioritise sources in this order:</p>
      <ol>
        <li>Government and regulators (primary rules and programs).</li>
        <li>Sector/industry bodies and public datasets or methodologies.</li>
        <li>Specialist publishers.</li>
        <li>Commercial directories (only with clear dating and scope).</li>
      </ol>
      <p>
        SEO and keyword tools are used for internal prioritisation only, never presented to
        readers as consumer cost data.
      </p>

      <h2 id="range-average">Range vs average vs estimate vs example</h2>
      <p>
        We keep the source&apos;s own wording. If a source publishes a range or ballpark, we
        say &ldquo;range&rdquo; — not &ldquo;average&rdquo;. A worked example is clearly labelled
        as an example using stated assumptions, never a market claim.
      </p>

      <h2 id="dates">Source dates and &ldquo;last checked&rdquo;</h2>
      <p>
        Every market figure carries the source&apos;s publication/update date and the date we
        last checked the source page. If an old figure is still the latest published source, we
        show its date rather than changing the year artificially.
      </p>

      <h2 id="variation">Why prices vary</h2>
      <p>
        Costs vary by state, job scope, property, access, finishes and market conditions. We do
        not apply a fixed state premium unless a dated source supports it.
      </p>

      <h2 id="calculators">How calculator assumptions work</h2>
      <p>
        Calculators compute in your browser from your inputs and a fixed, visible formula.
        Defaults are labelled assumptions, not facts, and tariffs are always user-supplied so we
        never assume a national electricity rate.
      </p>

      <h2 id="conflicts">Handling conflicting sources</h2>
      <p>
        When two sources use different scopes (material-only vs installed, repair vs restoration,
        average vs range), we keep them separate and show each with its definition. We do not
        silently average conflicting figures into a fabricated &ldquo;own&rdquo; number.
      </p>

      <h2 id="corrections">How corrections are made</h2>
      <p>
        Errors are fixed promptly and, where material, noted. See our{" "}
        <a href="/corrections">corrections policy</a> for how to report one.
      </p>

      <h2 id="disclaimer">Estimates, not quotes</h2>
      <p>
        Everything here is informational and not a quote. See the full{" "}
        <a href="/sources">source registry</a> and our{" "}
        <a href="/editorial-policy">editorial policy</a>.
      </p>
    </TrustLayout>
  );
}
