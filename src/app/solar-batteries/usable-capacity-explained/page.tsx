import type { Metadata } from "next";
import { ArticleLayout } from "@/components/templates/ArticleLayout";
import { Definition, Callout } from "@/components/content/callouts";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata("/solar-batteries/usable-capacity-explained");

export default function Page() {
  return (
    <ArticleLayout
      slug="/solar-batteries/usable-capacity-explained"
      breadcrumbs={[
        { name: "Solar & Batteries", href: "/solar-batteries" },
        { name: "Usable Capacity Explained", href: "/solar-batteries/usable-capacity-explained" },
      ]}
      dataChecked={false}
      answer={
        <p>
          A battery&apos;s <strong>usable capacity</strong> is the energy you can actually draw
          each cycle — always less than its <strong>nominal</strong> (rated) capacity. Two
          things reduce it: the manufacturer keeps some capacity in reserve (depth of
          discharge), and some energy is lost charging and discharging (round-trip
          efficiency). Both matter because payback is driven by usable, not nominal, kWh.
        </p>
      }
      related={[
        { label: "Solar battery payback calculator", href: "/calculators/solar-battery-payback", description: "Uses usable capacity and round-trip efficiency." },
        { label: "How tariffs affect battery payback", href: "/solar-batteries/tariffs-and-battery-payback" },
        { label: "Solar battery cost in Australia", href: "/solar-batteries/solar-battery-cost" },
        { label: "Solar battery STCs explained", href: "/solar-batteries/solar-battery-stcs-explained" },
      ]}
    >
      <h2 id="terms">The three numbers that matter</h2>
      <Definition term="Nominal (rated) capacity">
        The headline kWh figure on the spec sheet. It is not all available to use.
      </Definition>
      <Definition term="Usable capacity">
        The kWh you can actually cycle, after the reserved portion. This is the figure to enter
        in a payback calculation.
      </Definition>
      <Definition term="Round-trip efficiency">
        The share of energy that survives a full charge-then-discharge cycle (some is lost as
        heat). A common range is in the high-80s to mid-90s percent; use your unit&apos;s figure.
      </Definition>

      <h2 id="why-it-matters">Why it changes payback</h2>
      <p>
        If you charge a battery from spare solar and discharge it at night, the energy you
        avoid buying is limited by usable capacity <em>and</em> reduced by round-trip losses.
        A &ldquo;10 kWh&rdquo; battery does not automatically shift 10 kWh of useful energy each
        day. Our{" "}
        <a href="/calculators/solar-battery-payback">payback calculator</a> asks for usable
        capacity and efficiency precisely so the estimate is honest.
      </p>

      <h2 id="degradation">Capacity also fades over time</h2>
      <p>
        Batteries lose a little usable capacity each year (degradation). The payback model lets
        you enter an annual degradation percentage so later years are not overstated.
      </p>

      <Callout tone="info" title="What to ask your installer">
        Ask for the <strong>usable</strong> capacity (not just nominal), the round-trip
        efficiency, the warranty and the expected end-of-warranty capacity. Enter those into
        the calculator rather than trusting a single national payback claim.
      </Callout>
    </ArticleLayout>
  );
}
