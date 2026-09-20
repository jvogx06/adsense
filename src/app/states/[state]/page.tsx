import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HubLayout } from "@/components/templates/HubLayout";
import { LinkCard } from "@/components/ui/primitives";
import { Callout } from "@/components/content/callouts";
import { stateContexts, stateSlugs } from "@/lib/content/states";
import { pageMetadata } from "@/lib/seo/metadata";

export function generateStaticParams() {
  return stateSlugs.map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const ctx = stateContexts[state];
  if (!ctx) return {};
  return pageMetadata(ctx.slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const ctx = stateContexts[state];
  if (!ctx) notFound();

  return (
    <HubLayout
      slug={ctx.slug}
      breadcrumbs={[
        { name: "States", href: "/states" },
        { name: ctx.name, href: ctx.slug },
      ]}
      intro={`Home cost and energy context for ${ctx.name}. Local dollar figures are added only when we hold a verified, differentiated source — otherwise we point you to our national calculators, which use your own tariff and inputs.`}
    >
      <Callout tone="neutral" title="Australia-wide reference">
        <p>
          Most figures on this site are Australia-wide references. The notes below are general
          {` ${ctx.name}`} context that can affect your calculator assumptions — they are not
          fabricated local prices.
        </p>
      </Callout>

      <h2 className="mt-8 text-xl font-semibold">Climate &amp; usage</h2>
      <p className="mt-2 max-w-2xl text-muted">{ctx.climate}</p>

      <h2 className="mt-8 text-xl font-semibold">Energy context</h2>
      <p className="mt-2 max-w-2xl text-muted">{ctx.energyContext}</p>

      <h2 className="mt-8 text-xl font-semibold">Use our national tools with your numbers</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LinkCard href="/calculators/air-conditioner-running-cost" title="Air conditioner running cost" description="Uses your unit and your tariff." />
        <LinkCard href="/calculators/electricity-usage" title="Electricity usage" description="Your appliances and your tariff." />
        <LinkCard href="/calculators/solar-battery-payback" title="Solar battery payback" description="Your tariffs and solar surplus." />
        <LinkCard href="/solar-batteries/federal-battery-program" title="Federal battery program" description="National program, all states." />
        <LinkCard href="/renovations" title="Renovation cost guides" description="Sourced national ranges." />
        <LinkCard href="/trades" title="Tradie cost guides" description="Sourced national rate ranges." />
      </div>

      <Callout tone="info" title="Have verified local data?">
        <p>
          If you can point us to a dated, official source for {ctx.name}-specific costs or
          programs, our <a href="/corrections">corrections page</a> explains how to send it, and
          we&apos;ll add it with its source and date.
        </p>
      </Callout>
    </HubLayout>
  );
}
