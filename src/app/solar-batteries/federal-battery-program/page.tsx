import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { DataTable } from "@/components/content/DataTable";
import { UpdateNotice, Callout } from "@/components/content/callouts";
import { batteryProgram } from "@/data/programs/battery-program";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/solar-batteries/federal-battery-program");

export default function Page() {
  return (
    <ArticleLayout
      slug="/solar-batteries/federal-battery-program"
      breadcrumbs={[
        { name: "Solar & Batteries", href: "/solar-batteries" },
        { name: "Federal Battery Program", href: "/solar-batteries/federal-battery-program" },
      ]}
      answer={
        <p>
          The federal Cheaper Home Batteries Program provides{" "}
          <strong>{batteryProgram.headlineSupport}</strong> (indicative) for eligible home
          battery systems, with settings effective from{" "}
          {formatDate(batteryProgram.effectiveFrom)}. The 30% figure is not a guaranteed
          exact household discount, and support declines over time until 2030.
        </p>
      }
      related={[
        { label: "Battery discount estimator", href: "/calculators/battery-discount-estimator" },
        { label: "Solar battery cost", href: "/solar-batteries/solar-battery-cost" },
        { label: "Solar battery payback calculator", href: "/calculators/solar-battery-payback" },
      ]}
    >
      <UpdateNotice effectiveFrom={batteryProgram.effectiveFrom} />

      <h2 id="eligibility">Eligibility, in brief</h2>
      <p>{batteryProgram.capacityEligibilityNote}</p>
      <ul>
        <li>Nominal capacity roughly {batteryProgram.capacityEligibilityMinKWh}–{batteryProgram.capacityEligibilityMaxKWh} kWh.</li>
        <li>STC-style rules apply to eligible usable capacity.</li>
        <li>The support level declines over time until 2030.</li>
      </ul>

      <h2 id="notes">What to keep in mind</h2>
      <ul>
        {batteryProgram.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      <h2 id="changes">Change log</h2>
      <DataTable
        caption="Recorded changes and checks for this program dataset"
        columns={[
          { key: "date", header: "Date" },
          { key: "change", header: "Change / check" },
        ]}
        rows={batteryProgram.history.map((h) => ({ date: formatDate(h.date), change: h.change }))}
        footnote={`Dataset checked ${formatDate(batteryProgram.checkedAt)}.`}
      />

      <Callout tone="info" title="Estimate your discount">
        Try the{" "}
        <a href="/calculators/battery-discount-estimator">battery discount estimator</a>{" "}
        for a rough, dated indicative figure. It is not an official government calculator —
        always confirm with DCCEEW and your installer.
      </Callout>

      <p>
        Official source:{" "}
        <a href={batteryProgram.officialUrl} target="_blank" rel="noopener noreferrer">
          DCCEEW — Cheaper Home Batteries Program
        </a>
        .
      </p>
    </ArticleLayout>
  );
}
