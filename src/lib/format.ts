/**
 * Shared formatting utilities (Australian English / AUD).
 *
 * Never format currency, dates or units by hand in a component — use these so
 * the whole site is consistent (en-AU thousands separators, "A$" money, and
 * "20 September 2026" dates).
 */

const AUD = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 2,
});

const AUD0 = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

const NUM = new Intl.NumberFormat("en-AU");

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/**
 * Format money as AUD. Uses the "A$" symbol by default (unambiguous in
 * international contexts). Whole-dollar amounts drop the cents unless
 * `forceDecimals` is set.
 */
export function formatAUD(
  value: number,
  opts: { symbol?: "A$" | "$"; forceDecimals?: boolean } = {},
): string {
  if (!isFiniteNumber(value)) return "—";
  const { symbol = "A$", forceDecimals = false } = opts;
  const whole = Number.isInteger(value);
  const formatted = (whole && !forceDecimals ? AUD0 : AUD).format(value);
  // Intl "en-AU" prefixes "$"; swap to the requested symbol.
  const withoutSymbol = formatted.replace(/^\$/, "");
  return symbol === "A$" ? `A$${withoutSymbol}` : `$${withoutSymbol}`;
}

/** Format a low–high money range, e.g. "A$8,000–A$35,000". */
export function formatAUDRange(
  low: number | undefined,
  high: number | undefined,
  opts: { symbol?: "A$" | "$"; openEndedSuffix?: string } = {},
): string {
  const { openEndedSuffix = "+" } = opts;
  if (isFiniteNumber(low) && isFiniteNumber(high)) {
    return `${formatAUD(low, opts)}–${formatAUD(high, opts)}`;
  }
  if (isFiniteNumber(low)) return `${formatAUD(low, opts)}${openEndedSuffix}`;
  if (isFiniteNumber(high)) return `up to ${formatAUD(high, opts)}`;
  return "—";
}

/** Format a per-unit money range, e.g. "A$18–A$37/m²". */
export function formatAUDPerUnitRange(
  low: number | undefined,
  high: number | undefined,
  unitLabel: string,
): string {
  return `${formatAUDRange(low, high)}/${unitLabel}`;
}

/** en-AU number with thousands separators. */
export function formatNumber(value: number, maxDecimals = 2): string {
  if (!isFiniteNumber(value)) return "—";
  return new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

/** Format kWh with sensible precision for the magnitude. */
export function formatKWh(value: number): string {
  if (!isFiniteNumber(value)) return "—";
  const decimals = Math.abs(value) >= 100 ? 0 : Math.abs(value) >= 10 ? 1 : 2;
  return `${formatNumber(value, decimals)} kWh`;
}

/** Format a percentage from a 0–100 number, e.g. 30 -> "30%". */
export function formatPercent(value: number, maxDecimals = 1): string {
  if (!isFiniteNumber(value)) return "—";
  return `${formatNumber(value, maxDecimals)}%`;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Human-readable Australian date from a loose ISO string (YYYY, YYYY-MM,
 * YYYY-MM-DD), e.g. "20 September 2026", "September 2026", "2026".
 * Parsed manually to avoid timezone drift from `new Date`.
 */
export function formatDate(iso: string): string {
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(iso.trim());
  if (!match) return iso;
  const [, year, month, day] = match;
  const monthName = month ? MONTHS[Number(month) - 1] : undefined;
  if (day && monthName) return `${Number(day)} ${monthName} ${year}`;
  if (monthName) return `${monthName} ${year}`;
  return `${year}`;
}

/** Days between an ISO date and now (positive = in the past). */
export function daysSince(iso: string, now = new Date()): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return 0;
  const then = new Date(`${iso}T00:00:00Z`);
  const ms = now.getTime() - then.getTime();
  return Math.floor(ms / 86_400_000);
}

export { NUM };
