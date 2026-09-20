import type { Metadata } from "next";
import { TrustLayout } from "@/components/templates/TrustLayout";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/privacy-policy");

export default function Page() {
  const contactLine = siteConfig.contactConfigured
    ? siteConfig.contactEmail
    : "our contact page";
  const adsOn = siteConfig.adsenseEnabled;

  return (
    <TrustLayout
      slug="/privacy-policy"
      breadcrumbs={[{ name: "Privacy Policy", href: "/privacy-policy" }]}
      lead={`How ${siteConfig.siteName} handles personal information. This policy should be reviewed by a qualified legal professional before commercial launch.`}
    >
      <h2 id="who">Who we are</h2>
      <p>
        This site is operated by <strong>{siteConfig.publisherLegalName}</strong>. If you have
        a privacy question, you can reach us via{" "}
        {siteConfig.contactConfigured ? (
          <a href={`mailto:${siteConfig.contactEmail}`}>{contactLine}</a>
        ) : (
          <a href="/contact">{contactLine}</a>
        )}
        .
      </p>

      <h2 id="what">Information we collect</h2>
      <p>
        We aim to collect as little as possible. The calculators run entirely in your browser
        and we do not store your calculator inputs on our servers. Where analytics are enabled,
        aggregate usage data may be collected subject to your consent (see our{" "}
        <a href="/cookie-policy">cookie policy</a>). If you contact us, we receive the
        information you choose to provide.
      </p>

      <h2 id="cookies">Cookies and analytics</h2>
      <p>
        We use a small amount of local storage to remember your consent choice. Where Google
        Analytics is enabled, it loads only after you grant consent, with IP anonymisation and
        without ad-personalisation storage. You can decline, and the site works fully either way.
      </p>

      <h2 id="advertising">Advertising</h2>
      {adsOn ? (
        <>
          <p>
            This site shows third-party advertising through Google AdSense. In connection with
            that advertising:
          </p>
          <ul>
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on your
              previous visits to this site and/or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads
              to you based on your visits to this and/or other sites.
            </li>
            <li>
              You can opt out of personalised advertising by visiting{" "}
              <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              Other authorised third-party ad vendors or ad networks may also use cookies where
              applicable.
            </li>
          </ul>
        </>
      ) : (
        <>
          <p>
            This site does not currently show third-party advertising. If display advertising
            (initially Google AdSense) is enabled in future, then:
          </p>
          <ul>
            <li>
              Third-party vendors, including Google, may use cookies to serve ads based on your
              previous visits to this site and/or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies would enable it and its partners to serve
              ads to you based on your visits to this and/or other sites.
            </li>
            <li>
              You would be able to opt out of personalised advertising via{" "}
              <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              Other authorised third-party ad vendors or ad networks may also use cookies where
              applicable.
            </li>
          </ul>
          <p>We will update this section when advertising is actually enabled.</p>
        </>
      )}
      <p>
        Consent requirements apply according to your jurisdiction. Visitors in the EEA, UK and
        Switzerland are handled through a certified consent mechanism before any personalised
        ads are served.
      </p>

      <h2 id="app">Australian Privacy Principles</h2>
      <p>
        We aim to handle personal information consistently with the Australian Privacy
        Principles, including transparency, notification, use and disclosure, security, and
        access and correction.
      </p>

      <h2 id="access">Access and correction</h2>
      <p>
        You may request access to, or correction of, any personal information we hold about you
        by contacting us{" "}
        {siteConfig.contactConfigured ? (
          <a href={`mailto:${siteConfig.contactEmail}`}>by email</a>
        ) : (
          <a href="/contact">via our contact page</a>
        )}
        .
      </p>

      <h2 id="changes">Changes</h2>
      <p>We may update this policy; the &ldquo;updated&rdquo; date above reflects the latest revision.</p>
    </TrustLayout>
  );
}
