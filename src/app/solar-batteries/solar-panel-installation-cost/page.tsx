import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/solar-batteries/solar-panel-installation-cost");

export default function Page() {
  return (
    <ArticleLayout
      slug="/solar-batteries/solar-panel-installation-cost"
      breadcrumbs={[
        { name: "Solar & Batteries", href: "/solar-batteries" },
        { name: "Solar Panel Installation Cost", href: "/solar-batteries/solar-panel-installation-cost" },
      ]}
      dataChecked={false}
      answer={
        <p>
          Solar panel installation cost scales mainly with system size (kW), plus your roof
          type, access and any electrical work. Rather than publish an unverified per-kW
          price, this guide gives you a framework: size the system to your use, then get
          itemised quotes.
        </p>
      }
      related={[
        { label: "Solar system size calculator", href: "/calculators/solar-system-size" },
        { label: "Solar battery cost", href: "/solar-batteries/solar-battery-cost" },
        { label: "Solar battery payback calculator", href: "/calculators/solar-battery-payback" },
        { label: "Federal battery program", href: "/solar-batteries/federal-battery-program" },
      ]}
    >
      <h2 id="framework">A sizing-first framework</h2>
      <p>
        The most useful first step is sizing. Use the{" "}
        <a href="/calculators/solar-system-size">solar system size calculator</a> with your
        daily use, target offset and your own peak-sun-hours to find a system size in kW.
        Installation quotes are then priced around that size.
      </p>
      <h2 id="drivers">What changes the quote</h2>
      <ul>
        <li>System size (kW) — the biggest driver.</li>
        <li>Panel and inverter tier.</li>
        <li>Roof type, pitch, storeys and access.</li>
        <li>Switchboard or metering upgrades.</li>
        <li>Small-scale certificate value at the time of install.</li>
      </ul>
      <Callout tone="info" title="Why no per-kW price here">
        Per-kW pricing changes with market conditions and certificate prices. We only
        publish figures we can tie to a dated source, so here we give a framework and point
        you to itemised quotes instead of an invented number.
      </Callout>
      <h2 id="next">Next steps</h2>
      <p>
        Size the system, decide whether to add a battery now or later (see{" "}
        <a href="/solar-batteries/solar-battery-cost">battery cost</a>), and compare
        itemised quotes for the same system size.
      </p>
    </ArticleLayout>
  );
}
