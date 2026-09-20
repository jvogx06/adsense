import type { Metadata } from "next";
import Link from "next/link";
import { HubLayout } from "@/components/templates/HubLayout";
import { Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/states");

const states = [
  ["/states/nsw", "New South Wales"],
  ["/states/vic", "Victoria"],
  ["/states/qld", "Queensland"],
  ["/states/wa", "Western Australia"],
  ["/states/sa", "South Australia"],
  ["/states/tas", "Tasmania"],
  ["/states/act", "Australian Capital Territory"],
  ["/states/nt", "Northern Territory"],
] as const;

export default function Page() {
  return (
    <HubLayout
      slug="/states"
      breadcrumbs={[{ name: "States", href: "/states" }]}
      intro="Home running, energy and renovation costs can differ by state and territory — mostly through climate, local energy settings and labour markets. We only publish local figures where we have verified, differentiated data; otherwise we point you to our national tools."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {states.map(([href, name]) => (
          <Link
            key={href}
            href={href}
            className="rounded-[var(--radius-card)] border border-border bg-surface px-4 py-4 font-medium text-primary-dark no-underline hover:border-primary"
          >
            {name}
          </Link>
        ))}
      </div>

      <Callout tone="info" title="Why some state pages are light on local figures">
        <p>
          We refuse to clone the national text and swap a state name in, or invent a fixed
          &ldquo;state premium&rdquo;. Where we don&apos;t yet hold verified, differentiated
          local data, state pages stay focused on climate context and links to national
          calculators, and are kept out of search until they carry genuinely local data.
        </p>
      </Callout>
    </HubLayout>
  );
}
