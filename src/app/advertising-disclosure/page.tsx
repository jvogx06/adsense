import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { siteConfig } from "@/config/site";
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
        {siteConfig.adsenseEnabled
          ? "This site displays third-party advertising, initially through Google AdSense."
          : "This site may be supported by third-party advertising in future, initially through Google AdSense. It is not currently running."}{" "}
        Advertising helps fund the free calculators and cost guides we publish. When shown, ads
        are clearly distinct from our content and are never disguised as navigation,
        recommendations, calculator results or source links.
      </p>

      <h2 id="independence">Advertisers don&apos;t write our guides</h2>
      <p>
        Advertisers do not write, review or approve our content, and advertising does not
        influence our editorial conclusions or the figures we publish. See our{" "}
        <a href="/editorial-policy">editorial policy</a>.
      </p>

      <h2 id="future">Affiliate and sponsored relationships (future)</h2>
      <p>
        {siteConfig.adsenseEnabled
          ? "We currently run display advertising only."
          : "We do not currently run any advertising or affiliate relationships."}{" "}
        If we add affiliate links, lead referrals or sponsored content in future, we will label
        those relationships clearly and update this page. We will not quietly turn the site into
        a paid ranking, and we will not claim absolute independence if we later earn from
        referrals without disclosing it.
      </p>

      <h2 id="privacy">Advertising and your data</h2>
      <p>
        Advertising and analytics may use cookies or similar technologies. See our{" "}
        <a href="/cookie-policy">cookie policy</a> and <a href="/privacy-policy">privacy policy</a>.
        Visitors in the EEA, UK and Switzerland are handled through a certified consent mechanism
        before any personalised ads are served.
      </p>

      <h2 id="contact">Questions about advertising</h2>
      <p>
        For questions about advertising on this site, email us at{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </TrustLayout>
  );
}
