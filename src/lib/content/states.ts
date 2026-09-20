/**
 * Per-state qualitative context. Deliberately NO fabricated local prices or
 * percentages (spec §33/§66). Climate notes are general context that legitimately
 * affects calculator assumptions; local dollar figures are added only when a dated,
 * verified source exists.
 */
export interface StateContext {
  code: string;
  slug: string;
  name: string;
  climate: string;
  energyContext: string;
}

export const stateContexts: Record<string, StateContext> = {
  nsw: {
    code: "NSW",
    slug: "/states/nsw",
    name: "New South Wales",
    climate:
      "NSW spans coastal, alpine and inland climates, so heating and cooling loads vary widely between, say, Sydney and the Snowy region.",
    energyContext:
      "Electricity tariffs and any state energy programs change over time; use your own tariff in our calculators and check current NSW programs with official sources.",
  },
  vic: {
    code: "VIC",
    slug: "/states/vic",
    name: "Victoria",
    climate:
      "Victoria's cooler winters typically mean more heating demand, which shifts the balance of annual running costs toward heating.",
    energyContext:
      "Victoria runs its own energy efficiency initiatives that change over time; confirm current details with official sources and use your own tariff in our tools.",
  },
  qld: {
    code: "QLD",
    slug: "/states/qld",
    name: "Queensland",
    climate:
      "Queensland's warmer, more humid climate generally increases cooling demand, so air-conditioning running cost is often a larger share of the annual bill.",
    energyContext:
      "Strong rooftop-solar uptake is common in Queensland; model your own system with our solar tools and check current local programs officially.",
  },
  wa: {
    code: "WA",
    slug: "/states/wa",
    name: "Western Australia",
    climate:
      "WA ranges from a Mediterranean south-west to hot northern regions, so cooling demand varies significantly by location.",
    energyContext:
      "WA has its own electricity market arrangements and battery/VPP settings that differ from the eastern states; confirm current WA specifics with official sources.",
  },
  sa: {
    code: "SA",
    slug: "/states/sa",
    name: "South Australia",
    climate:
      "South Australia's hot, dry summers can drive high cooling demand during heatwaves.",
    energyContext:
      "SA has high renewable penetration and its own energy settings; use your own tariff in our tools and confirm current SA programs officially.",
  },
  tas: {
    code: "TAS",
    slug: "/states/tas",
    name: "Tasmania",
    climate:
      "Tasmania's cool climate means heating is typically the dominant energy load across the year.",
    energyContext:
      "Tasmania's energy mix and programs differ from the mainland; confirm current details officially and use your own tariff in our tools.",
  },
  act: {
    code: "ACT",
    slug: "/states/act",
    name: "Australian Capital Territory",
    climate:
      "The ACT experiences cold winters and warm summers, so both heating and cooling contribute to annual costs.",
    energyContext:
      "The ACT runs its own sustainability and energy programs that change over time; confirm current details with official sources.",
  },
  nt: {
    code: "NT",
    slug: "/states/nt",
    name: "Northern Territory",
    climate:
      "The NT's tropical and arid zones bring high year-round cooling demand in much of the Territory.",
    energyContext:
      "The NT has distinct electricity arrangements; use your own tariff in our tools and confirm current NT programs officially.",
  },
};

export const stateSlugs = Object.keys(stateContexts);
