import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/advertising-disclosure");

export default function Page() {
  return (
    <TrustLayout
      slug="/advertising-disclosure"
      breadcrumbs={[{ name: "Advertising Disclosure", href: "/advertising-disclosure" }]}
      lead="How advertising works on this site, and how it stays separate from our editorial content."
    >
      <h2 id="display">Display advertising</h2>
      <p>
        This site may display third-party advertising, initially through Google AdSense.
        Advertising helps fund the free calculators and cost guides we publish. Ads are clearly
        distinct from our content and are never disguised as navigation, recommendations,
        calculator results or source links.
      </p>

      <h2 id="independence">Advertisers don&apos;t write our guides</h2>
      <p>
        Advertisers do not write, review or approve our content, and advertising does not
        influence our editorial conclusions or the figures we publish. See our{" "}
        <a href="/editorial-policy">editorial policy</a>.
      </p>

      <h2 id="future">Affiliate and sponsored relationships (future)</h2>
      <p>
        We currently run display advertising only. If we add affiliate links, lead referrals or
        sponsored content in future, we will label those relationships clearly and update this
        page. We will not quietly turn the site into a paid ranking, and we will not claim
        absolute independence if we later earn from referrals without disclosing it.
      </p>

      <h2 id="privacy">Advertising and your data</h2>
      <p>
        Advertising and analytics may use cookies or similar technologies. See our{" "}
        <a href="/cookie-policy">cookie policy</a> and <a href="/privacy-policy">privacy policy</a>.
        Visitors in the EEA, UK and Switzerland are handled through a certified consent mechanism
        before any personalised ads are served.
      </p>
    </TrustLayout>
  );
}
