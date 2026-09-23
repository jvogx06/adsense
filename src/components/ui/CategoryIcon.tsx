import type { ReactElement } from "react";

/**
 * Lightweight, dependency-free category icon system (spec: moderate visual
 * upgrade). Clean single-colour line icons in the brand palette — no emoji, no
 * childish style, no raster assets. Icons inherit `currentColor` (set the colour
 * on a wrapper, e.g. `text-primary`) so they never introduce a new palette.
 *
 * Purely decorative by default (`aria-hidden`); pass a `title` only when the
 * icon must convey meaning on its own (rare — labels sit next to it everywhere).
 */
export type CategoryIconName =
  | "air-conditioning"
  | "solar"
  | "battery"
  | "electricity"
  | "bathroom"
  | "kitchen"
  | "renovation"
  | "roofing"
  | "electrician"
  | "plumber"
  | "hot-water"
  | "pool"
  | "ev-charging"
  | "calculators"
  | "trades";

// viewBox 0 0 24 24, stroke-based; consistent weight and rounded joins.
const PATHS: Record<CategoryIconName, ReactElement> = {
  "air-conditioning": (
    <>
      <rect x="3" y="5" width="18" height="8" rx="2" />
      <path d="M6 9.5h12" />
      <path d="M7 16c0 1.2-.8 2-2 2m6-2c0 1.2-.8 2-2 2m6-2c0 1.2-.8 2-2 2m6-2c0 1.2-.8 2-2 2" />
    </>
  ),
  solar: (
    <>
      <rect x="3" y="4" width="18" height="11" rx="1" />
      <path d="M3 8h18M3 11.5h18M9 4v11M15 4v11" />
      <path d="M8 20h8M12 15v5" />
    </>
  ),
  battery: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9.5 4V2.5h5V4" />
      <path d="M12 9l-2 3.5h4L12 16" />
    </>
  ),
  electricity: (
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" />
  ),
  bathroom: (
    <>
      <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2Z" />
      <path d="M7 12V6a2 2 0 0 1 2-2h1" />
      <path d="M10 4.5h3" />
      <path d="M8 22l-1-1M16 22l1-1" />
    </>
  ),
  kitchen: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <circle cx="15" cy="9" r="1.5" />
      <circle cx="9" cy="15" r="1.5" />
      <circle cx="15" cy="15" r="1.5" />
    </>
  ),
  renovation: (
    <>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-4h4v4" />
    </>
  ),
  roofing: (
    <>
      <path d="M3 12 12 5l9 7" />
      <path d="M6 10.5 12 6l6 4.5" />
      <path d="M5 12v7h14v-7" />
    </>
  ),
  electrician: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h3M8 11h3M8 15h3" />
      <path d="M15 6v4M15 6l-1.5 1.5M15 6l1.5 1.5" />
    </>
  ),
  plumber: (
    <>
      <path d="M7 3v6a5 5 0 0 0 5 5h1a4 4 0 0 1 4 4v3" />
      <path d="M5 3h4M14 21h6" />
      <circle cx="12" cy="9" r="0" />
    </>
  ),
  "hot-water": (
    <>
      <rect x="6" y="4" width="12" height="16" rx="3" />
      <path d="M9 4V2.5M15 4V2.5" />
      <path d="M12 9c-1.5 1.6-1.5 3.2 0 4.8 1.5-1.6 1.5-3.2 0-4.8Z" strokeLinejoin="round" />
    </>
  ),
  pool: (
    <>
      <path d="M3 15c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
      <path d="M3 19c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
      <path d="M8 13V5a2 2 0 0 1 4 0M8 8h4" />
    </>
  ),
  "ev-charging": (
    <>
      <rect x="4" y="4" width="10" height="16" rx="2" />
      <path d="M7 9l-1 3h3l-1 3" />
      <path d="M17 8v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2v-5l-2-2" />
      <path d="M18 5v2M20 5v2" />
    </>
  ),
  calculators: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <rect x="8" y="6" width="8" height="3" rx="0.5" />
      <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
    </>
  ),
  trades: (
    <>
      <path d="M14 6a3.5 3.5 0 0 0-4.7 4.5L4 15.8V20h4.2l5.3-5.3A3.5 3.5 0 0 0 18 10l-2.5 2.5L13 10l2.5-2.5A3.5 3.5 0 0 0 14 6Z" strokeLinejoin="round" />
    </>
  ),
};

export function CategoryIcon({
  name,
  size = 40,
  className = "",
  title,
}: {
  name: CategoryIconName;
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}

/**
 * Maps a page slug (or category) to a sensible icon. Explicit per-page mapping
 * first, then a category fallback, so cards vary their icons instead of
 * repeating one icon across a whole hub.
 */
const SLUG_ICON: Record<string, CategoryIconName> = {
  // Air conditioning
  "/air-conditioning": "air-conditioning",
  "/air-conditioning/ducted-air-conditioning-cost": "air-conditioning",
  "/air-conditioning/split-system-installation-cost": "air-conditioning",
  "/air-conditioning/ducted-vs-split-system": "air-conditioning",
  "/air-conditioning/air-conditioning-repair-cost": "trades",
  "/air-conditioning/reverse-cycle-running-cost": "electricity",
  "/air-conditioning/electricity-usage": "electricity",
  // Solar & batteries
  "/solar-batteries": "solar",
  "/solar-batteries/solar-battery-cost": "battery",
  "/solar-batteries/solar-panel-installation-cost": "solar",
  "/solar-batteries/federal-battery-program": "battery",
  "/solar-batteries/solar-battery-stcs-explained": "battery",
  "/solar-batteries/usable-capacity-explained": "battery",
  "/solar-batteries/tariffs-and-battery-payback": "electricity",
  // Renovations
  "/renovations": "renovation",
  "/renovations/bathroom-renovation-cost": "bathroom",
  "/renovations/kitchen-renovation-cost": "kitchen",
  "/renovations/roof-replacement-cost": "roofing",
  "/renovations/roof-restoration-cost": "roofing",
  "/renovations/whole-home-renovation-cost": "renovation",
  // Trades
  "/trades": "trades",
  "/trades/electrician-cost": "electrician",
  "/trades/plumber-cost": "plumber",
  "/trades/switchboard-upgrade-cost": "electrician",
  // Calculators
  "/calculators": "calculators",
  "/calculators/air-conditioner-running-cost": "air-conditioning",
  "/calculators/electricity-usage": "electricity",
  "/calculators/solar-battery-payback": "battery",
  "/calculators/solar-system-size": "solar",
  "/calculators/battery-discount-estimator": "battery",
  "/calculators/home-renovation-budget": "renovation",
  "/calculators/ev-charging-cost": "ev-charging",
  "/calculators/pool-running-cost": "pool",
};

export function iconForSlug(slug: string): CategoryIconName | undefined {
  return SLUG_ICON[slug];
}
