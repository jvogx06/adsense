import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/corrections");

export default function Page() {
  return (
    <TrustLayout
      slug="/corrections"
      breadcrumbs={[{ name: "Corrections Policy", href: "/corrections" }]}
      lead="Found an error or an out-of-date figure? Please tell us — accuracy matters more to us than page count."
    >
      <h2 id="report">How to report an error</h2>
      <p>
        {siteConfig.contactEmail ? (
          <>Email us at <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>{" "}
          with the page URL and, ideally, a dated source.</>
        ) : (
          <>Use the details on our <a href="/contact">contact page</a>, including the page URL and,
          ideally, a dated source.</>
        )}
      </p>

      <h2 id="what-we-do">What we do with it</h2>
      <ul>
        <li>We check the report against the cited source and any newer official source.</li>
        <li>If a figure is wrong or outdated, we correct it and update the &ldquo;last checked&rdquo; date.</li>
        <li>For material changes, we note what changed (for program data, in the page&apos;s change log).</li>
      </ul>

      <h2 id="cadence">Update cadence</h2>
      <p>
        We review rebates and programs most frequently, then pricing references, on a rolling
        schedule. See our <a href="/methodology">methodology</a> for details, and our{" "}
        <a href="/editorial-policy">editorial policy</a> for the principles behind corrections.
      </p>
    </TrustLayout>
  );
}
