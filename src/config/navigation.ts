/** Site navigation model (spec §6). Labels use Australian English. */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

/** Primary header navigation. */
export const primaryNav: NavLink[] = [
  { label: "Calculators", href: "/calculators" },
  { label: "Energy & Solar", href: "/solar-batteries" },
  { label: "Air Conditioning", href: "/air-conditioning" },
  { label: "Renovations", href: "/renovations" },
  { label: "Tradie Costs", href: "/trades" },
  { label: "States", href: "/states" },
];

export const footerColumns: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Calculators", href: "/calculators" },
      { label: "Air Conditioning", href: "/air-conditioning" },
      { label: "Solar & Batteries", href: "/solar-batteries" },
      { label: "Renovations", href: "/renovations" },
      { label: "Tradie Costs", href: "/trades" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Methodology", href: "/methodology" },
      { label: "Data Sources", href: "/sources" },
      { label: "Editorial Policy", href: "/editorial-policy" },
      { label: "About", href: "/about" },
      { label: "Corrections", href: "/corrections" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Advertising Disclosure", href: "/advertising-disclosure" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "States",
    links: [
      { label: "New South Wales", href: "/states/nsw" },
      { label: "Victoria", href: "/states/vic" },
      { label: "Queensland", href: "/states/qld" },
      { label: "Western Australia", href: "/states/wa" },
      { label: "All states & territories", href: "/states" },
    ],
  },
];
