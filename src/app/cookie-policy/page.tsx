import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/cookie-policy");

export default function Page() {
  return (
    <TrustLayout
      slug="/cookie-policy"
      breadcrumbs={[{ name: "Cookie Policy", href: "/cookie-policy" }]}
      lead="How this site uses cookies and similar technologies for analytics and, in future, advertising."
    >
      <h2 id="what">What we use</h2>
      <p>
        We keep tracking minimal. A small amount of local storage may remember your consent choice
        and per-visit preferences. If analytics are enabled, Google Analytics 4 may set cookies —
        but only after you consent.
      </p>

      <h2 id="analytics">Analytics consent</h2>
      <p>
        No analytics run until you choose &ldquo;Allow analytics&rdquo;. You can decline, and the
        site works fully either way. Analytics are configured with IP anonymisation and without ad
        personalisation storage.
      </p>

      <h2 id="advertising">Advertising</h2>
      <p>
        If third-party advertising (initially Google AdSense) is enabled, it may use cookies or
        similar technologies. See our <a href="/advertising-disclosure">advertising disclosure</a>.
      </p>

      <h2 id="eea">EEA, UK and Switzerland</h2>
      <p>
        Serving personalised ads to visitors in the EEA, UK and Switzerland requires a Consent
        Management Platform certified with the IAB Transparency &amp; Consent Framework and
        integrated with Google. We prepare for a certified CMP (such as Google Privacy &amp;
        Messaging) and do not operate a home-made CMP claiming certification.
      </p>

      <h2 id="control">Managing cookies</h2>
      <p>
        You can clear or block cookies in your browser settings. Doing so may reset your saved
        consent choice.
      </p>
    </TrustLayout>
  );
}
