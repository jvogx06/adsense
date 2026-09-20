/**
 * Calculator metadata registry — the single list the hub, homepage and
 * cannibalisation checks read from. Formula logic lives in the sibling modules;
 * this file only describes the calculators.
 */

export type CalculatorGroup = "Energy" | "Solar" | "Renovation" | "Trades";

export interface CalculatorMeta {
  id: string;
  name: string;
  route: string;
  group: CalculatorGroup;
  shortDescription: string;
  primaryKeyword: string;
  /** Popular tools surface on the homepage. */
  popular?: boolean;
  /** Embedded tools live inside a guide/hub rather than a dedicated route. */
  embedded?: boolean;
}

export const calculators: CalculatorMeta[] = [
  {
    id: "air-conditioner-running-cost",
    name: "Air Conditioner Running Cost Calculator",
    route: "/calculators/air-conditioner-running-cost",
    group: "Energy",
    shortDescription:
      "Estimate daily, monthly and annual air-con electricity costs from your own power rating, usage and tariff.",
    primaryKeyword: "air conditioner running cost calculator",
    popular: true,
  },
  {
    id: "solar-battery-payback",
    name: "Solar Battery Payback Calculator",
    route: "/calculators/solar-battery-payback",
    group: "Solar",
    shortDescription:
      "Model simple battery payback and 10-year savings from your installed cost, usable capacity, tariffs and solar surplus.",
    primaryKeyword: "solar battery payback calculator Australia",
    popular: true,
  },
  {
    id: "solar-system-size",
    name: "Solar System Size Calculator",
    route: "/calculators/solar-system-size",
    group: "Solar",
    shortDescription:
      "Size a solar system from your daily use, target offset and your own peak-sun-hours — no invented irradiance defaults.",
    primaryKeyword: "solar system size calculator Australia",
    popular: true,
  },
  {
    id: "electricity-usage",
    name: "Electricity Usage Calculator",
    route: "/calculators/electricity-usage",
    group: "Energy",
    shortDescription:
      "Add appliances (power × hours × tariff) for daily, monthly and annual electricity costs.",
    primaryKeyword: "electricity usage calculator",
    popular: true,
  },
  {
    id: "ev-charging-cost",
    name: "EV Charging Cost Calculator",
    route: "/calculators/ev-charging-cost",
    group: "Energy",
    shortDescription:
      "Compare home, mixed and public EV charging costs from your consumption, distance and tariffs.",
    primaryKeyword: "EV charging cost calculator Australia",
    popular: true,
  },
  {
    id: "pool-running-cost",
    name: "Pool Running Cost Calculator",
    route: "/calculators/pool-running-cost",
    group: "Energy",
    shortDescription:
      "Estimate pool pump (and optional heater) energy and cost from your equipment and schedule.",
    primaryKeyword: "pool running cost calculator Australia",
  },
  {
    id: "home-renovation-budget",
    name: "Home Renovation Budget Calculator",
    route: "/calculators/home-renovation-budget",
    group: "Renovation",
    shortDescription:
      "Build a line-item renovation budget with contingency and low/base/high scenarios.",
    primaryKeyword: "renovation budget calculator Australia",
    popular: true,
  },
  {
    id: "battery-discount-estimator",
    name: "Federal Battery Discount Estimator",
    route: "/calculators/battery-discount-estimator",
    group: "Solar",
    shortDescription:
      "A rough, dated indicative estimate of the federal battery discount — not an official government calculator.",
    primaryKeyword: "battery rebate calculator Australia",
  },
];

const byId = new Map(calculators.map((c) => [c.id, c]));
const byRoute = new Map(calculators.map((c) => [c.route, c]));

export function getCalculator(id: string): CalculatorMeta | undefined {
  return byId.get(id);
}

export function getCalculatorByRoute(route: string): CalculatorMeta | undefined {
  return byRoute.get(route);
}

export function calculatorsByGroup(): Record<CalculatorGroup, CalculatorMeta[]> {
  const groups: Record<CalculatorGroup, CalculatorMeta[]> = {
    Energy: [],
    Solar: [],
    Renovation: [],
    Trades: [],
  };
  for (const c of calculators) groups[c.group].push(c);
  return groups;
}

export const popularCalculators = calculators.filter((c) => c.popular);
