import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { Callout } from "@/components/content/callouts";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/terms");

export default function Page() {
  return (
    <TrustLayout
      slug="/terms"
      breadcrumbs={[{ name: "Terms of Use", href: "/terms" }]}
      lead="Informational-only terms for using this site."
    >
      <Callout tone="neutral" title="Please note">
        <p>
          These terms provide general information about using this site and should be reviewed by
          a qualified legal professional before commercial launch. They are not legal advice.
        </p>
      </Callout>

      <h2 id="use">Use of the site</h2>
      <p>
        This site provides general information and calculators for Australian home costs and energy.
        It is provided by <strong>{siteConfig.publisherLegalName}</strong> for informational purposes
        only.
      </p>

      <h2 id="no-advice">Not professional advice</h2>
      <p>
        Content is not financial, legal, electrical, building or tax advice, and estimates are not
        quotes. See our <a href="/disclaimer">disclaimer</a>. Always confirm with a licensed
        professional and official sources before acting.
      </p>

      <h2 id="ip">Intellectual property</h2>
      <p>
        Our original text, tools and data compilations are ours. You may link to and cite our pages
        with attribution; you may not republish substantial content as your own.
      </p>

      <h2 id="liability">Limitation of liability</h2>
      <p>
        To the extent permitted by law, we are not liable for decisions made in reliance on estimates
        or information on this site. Always confirm figures with a licensed professional and official
        sources before acting.
      </p>

      <h2 id="changes">Changes</h2>
      <p>We may update these terms; the &ldquo;updated&rdquo; date above reflects the latest revision.</p>

      <h2 id="contact">Questions about these terms</h2>
      <p>
        For questions relating to these terms, email us at{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </TrustLayout>
  );
}
