import Link from "next/link";
import type { Metadata } from "next";
import { Container, LinkCard, Button, SectionHeading, Eyebrow, TrustBadge } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { LastChecked } from "@/components/content/sources";
import { popularCalculators } from "@/lib/calculators/registry";
import { recentlyUpdated, getContent } from "@/lib/content/registry";
import { batteryProgram } from "@/data/programs/battery-program";
import { pageMetadata } from "@/lib/seo/metadata";
import { organisationLd, webSiteLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/format";
import { AdReadySpace } from "@/components/ads/AdReadySpace";

export const metadata: Metadata = pageMetadata("/");

const categories = [
  { href: "/solar-batteries", title: "Energy & Solar", description: "Battery payback, solar sizing, running costs and the federal program." },
  { href: "/air-conditioning", title: "Air Conditioning", description: "Ducted, split and repair costs, plus a running-cost calculator." },
  { href: "/renovations", title: "Renovations", description: "Bathroom, kitchen, roof and whole-home cost guides and a budget tool." },
  { href: "/trades", title: "Tradie Costs", description: "Sourced electrician and plumber rates and how to compare quotes." },
];

const popularGuides = [
  "/renovations/bathroom-renovation-cost",
  "/renovations/kitchen-renovation-cost",
  "/renovations/roof-restoration-cost",
  "/trades/plumber-cost",
  "/trades/electrician-cost",
  "/solar-batteries/solar-battery-cost",
];

const states = [
  ["/states/nsw", "NSW"],
  ["/states/vic", "VIC"],
  ["/states/qld", "QLD"],
  ["/states/wa", "WA"],
  ["/states/sa", "SA"],
  ["/states/tas", "TAS"],
  ["/states/act", "ACT"],
  ["/states/nt", "NT"],
] as const;

export default function HomePage() {
  const latest = recentlyUpdated(6);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <Container className="py-12 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <Eyebrow>Australian home cost calculators &amp; guides</Eyebrow>
              <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">
                Know what your Australian home costs to run, repair and improve.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted">
                Independent calculators and cost guides built from dated Australian sources.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/calculators">Browse calculators</Button>
                <Button href="/renovations" variant="secondary">
                  Explore cost guides
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <TrustBadge>Australian data</TrustBadge>
                <TrustBadge>Sources shown</TrustBadge>
                <TrustBadge>Updated regularly</TrustBadge>
                <TrustBadge>No quote required</TrustBadge>
              </div>
            </div>

            {/* Mini dashboard card — three example tools, not a stock photo. */}
            <div className="rounded-[var(--radius-card)] border border-border bg-background p-5 shadow-card">
              <p className="text-sm font-semibold text-muted">Popular tools</p>
              <ul className="mt-3 flex flex-col gap-2">
                {popularCalculators.slice(0, 3).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={c.route}
                      className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3 no-underline hover:border-primary"
                    >
                      <span className="font-medium text-primary-dark">{c.name}</span>
                      <span aria-hidden="true" className="text-primary">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Natural space between hero and main content for Auto Ads. */}
      <AdReadySpace />

      {/* Popular calculators */}
      <Container className="py-12">
        <SectionHeading title="Popular calculators" intro="Real formula calculators that run in your browser — no login, no email." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularCalculators.map((c) => (
            <LinkCard key={c.id} href={c.route} title={c.name} description={c.shortDescription} eyebrow={c.group} />
          ))}
        </div>
      </Container>

      {/* What are you planning? */}
      <section className="bg-surface py-12">
        <Container>
          <SectionHeading title="What are you planning?" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <LinkCard key={cat.href} href={cat.href} title={cat.title} description={cat.description} />
            ))}
          </div>
        </Container>
      </section>

      {/* Current Australian data callout */}
      <Container className="py-12">
        <div className="rounded-[var(--radius-card)] border border-info/30 bg-info/5 p-6">
          <Eyebrow>Current Australian data</Eyebrow>
          <h2 className="mt-1 text-xl font-semibold">Federal Cheaper Home Batteries Program</h2>
          <p className="mt-2 max-w-2xl text-muted">
            The program targets around {batteryProgram.approxProgramTargetPercent}% off eligible
            battery costs (approximate), delivered through STCs, with settings effective from{" "}
            {formatDate(batteryProgram.effectiveFrom)}. Support declines over time.
            This is not a breaking-news feed — we re-check the official source on a schedule.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <LastChecked date={batteryProgram.checkedAt} />
            <Link href="/solar-batteries/federal-battery-program" className="font-medium">
              Read the program guide →
            </Link>
          </div>
        </div>
      </Container>

      {/* Popular cost guides */}
      <section className="bg-surface py-12">
        <Container>
          <SectionHeading title="Popular cost guides" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularGuides.map((slug) => {
              const e = getContent(slug);
              return <LinkCard key={slug} href={slug} title={e.title} description={e.description} />;
            })}
          </div>
        </Container>
      </section>

      {/* Costs by state */}
      <Container className="py-12">
        <SectionHeading title="Costs by state & territory" intro="We show real local differences only where we have verified data — no fabricated state premiums." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {states.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-[var(--radius-card)] border border-border bg-surface px-4 py-3 text-center font-medium text-primary-dark no-underline hover:border-primary"
            >
              {label}
            </Link>
          ))}
        </div>
      </Container>

      {/* Second natural space lower down, between large content blocks. */}
      <AdReadySpace />

      {/* How our numbers work */}
      <section className="bg-surface py-12">
        <Container>
          <SectionHeading title="How our numbers work" />
          <ol className="grid gap-4 sm:grid-cols-3">
            {[
              ["Collect dated sources", "Every market figure traces to a source record with an organisation and a date."],
              ["Preserve scope", "We keep each source's exact meaning — a range stays a range; we never average conflicting scopes."],
              ["Show assumptions", "Calculators use your inputs and a visible formula, so you can see exactly what drives the result."],
            ].map(([title, body], i) => (
              <li key={title} className="rounded-[var(--radius-card)] border border-border bg-background p-5">
                <div className="text-2xl font-bold text-primary">{i + 1}</div>
                <h3 className="mt-1 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm">
            <Link href="/methodology" className="font-medium">Read our full methodology →</Link>
          </p>
        </Container>
      </section>

      {/* Recently updated */}
      <Container className="py-12">
        <SectionHeading title="Recently updated" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {latest.map((e) => (
            <li key={e.slug}>
              <Link href={e.slug} className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface px-4 py-3 no-underline hover:border-primary">
                <span className="font-medium text-primary-dark">{e.title}</span>
                <span className="shrink-0 text-xs text-muted">{formatDate(e.updatedAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <JsonLd data={[organisationLd(), webSiteLd()]} />
    </>
  );
}
