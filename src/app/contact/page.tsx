import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/contact");

export default function Page() {
  return (
    <TrustLayout
      slug="/contact"
      breadcrumbs={[{ name: "Contact", href: "/contact" }]}
      lead="Get in touch about a correction, a data source or a general question."
    >
      <h2 id="email">Email us</h2>
      <p>
        The best way to reach us is by email at{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. For
        corrections, please include the page URL and, if possible, a dated source.
      </p>

      <h2 id="corrections">Corrections</h2>
      <p>
        To report an error in a figure or calculator, see our{" "}
        <a href="/corrections">corrections policy</a>. Accuracy is our priority.
      </p>

      <h2 id="what-we-dont">What we&apos;re not</h2>
      <p>
        We&apos;re an independent information site — not a tradie marketplace or directory. We
        don&apos;t take bookings, arrange quotes or pass your details to businesses.
      </p>
    </TrustLayout>
  );
}
