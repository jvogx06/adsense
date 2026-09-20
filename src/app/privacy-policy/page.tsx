import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { Callout } from "@/components/content/callouts";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/privacy-policy");

export default function Page() {
  const contact = siteConfig.contactEmail || "{{PUBLIC_CONTACT_EMAIL}}";
  return (
    <TrustLayout
      slug="/privacy-policy"
      breadcrumbs={[{ name: "Privacy Policy", href: "/privacy-policy" }]}
      lead="How this site handles personal information. This is a template that the site owner must complete and have reviewed before a production launch."
    >
      <Callout tone="warning" title="Template — complete before launch">
        <p>
          This policy contains placeholders such as{" "}
          <code>{siteConfig.publisherLegalName}</code> and{" "}
          <code>{contact}</code>. The owner must complete real business details and have this
          reviewed against the Australian Privacy Principles before production.
        </p>
      </Callout>

      <h2 id="who">Who we are</h2>
      <p>
        This site is operated by <strong>{siteConfig.publisherLegalName}</strong> (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;). You can contact us at <strong>{contact}</strong>.
      </p>

      <h2 id="what">Information we collect</h2>
      <p>
        We aim to collect as little as possible. The calculators run in your browser and we do not
        store your calculator inputs on our servers. If analytics are enabled, aggregate usage data
        may be collected subject to your consent (see our <a href="/cookie-policy">cookie policy</a>).
        If you contact us, we receive the information you provide.
      </p>

      <h2 id="cookies">Cookies, analytics and advertising</h2>
      <p>
        We may use privacy-friendly analytics and, in future, third-party advertising, which can use
        cookies or similar technologies. Visitors in the EEA, UK and Switzerland are handled through a
        certified consent mechanism. See our <a href="/cookie-policy">cookie policy</a>.
      </p>

      <h2 id="app">Australian Privacy Principles</h2>
      <p>
        We aim to handle personal information consistently with the Australian Privacy Principles,
        including transparency, notification, use and disclosure, security, and access and correction.
        This template must be completed with the owner&apos;s real practices before launch.
      </p>

      <h2 id="access">Access and correction</h2>
      <p>
        You may request access to or correction of any personal information we hold about you by
        contacting <strong>{contact}</strong>.
      </p>

      <h2 id="changes">Changes</h2>
      <p>We may update this policy; the &ldquo;updated&rdquo; date above reflects the latest revision.</p>
    </TrustLayout>
  );
}
