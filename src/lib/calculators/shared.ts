/**
 * Shared helpers for calculator formulas.
 *
 * Formulas are pure functions with no UI dependency (spec §12). They compute in
 * full `number` precision and only the UI rounds for display (spec §54). Hard
 * invalid inputs (e.g. would divide by zero) throw a `CalculatorError` carrying
 * a plain-language message; soft issues are returned as `warnings`.
 */

export class CalculatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalculatorError";
  }
}

/** Convert a tariff in cents/kWh to AUD/kWh (spec §54.2). */
export function centsToAUD(cents: number): number {
  return cents / 100;
}

/** Assert a value is a finite number, else throw a plain-language error. */
export function assertFinite(value: number, label: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new CalculatorError(`Enter a valid number for ${label}.`);
  }
  return value;
}

/** Assert a value is finite and >= 0. */
export function assertNonNegative(value: number, label: string): number {
  assertFinite(value, label);
  if (value < 0) {
    throw new CalculatorError(`${label} cannot be negative.`);
  }
  return value;
}

/** Assert a value is finite and strictly > 0 (for divisors). */
export function assertPositive(value: number, label: string): number {
  assertFinite(value, label);
  if (value <= 0) {
    throw new CalculatorError(`${label} must be greater than zero.`);
  }
  return value;
}

/**
 * Normalise a possibly comma-decimal string ("1.234,56" or "1,234.56") to a
 * number, cautiously (spec §55). Returns NaN if it cannot be parsed clearly.
 */
export function parseLooseNumber(input: string): number {
  const trimmed = input.trim();
  if (trimmed === "") return NaN;
  const hasComma = trimmed.includes(",");
  const hasDot = trimmed.includes(".");
  let normalised = trimmed;
  if (hasComma && hasDot) {
    // Whichever separator is last is the decimal separator.
    if (trimmed.lastIndexOf(",") > trimmed.lastIndexOf(".")) {
      normalised = trimmed.replace(/\./g, "").replace(",", ".");
    } else {
      normalised = trimmed.replace(/,/g, "");
    }
  } else if (hasComma) {
    // A single comma with 1-2 trailing digits is likely a decimal comma.
    normalised = /,\d{1,2}$/.test(trimmed)
      ? trimmed.replace(",", ".")
      : trimmed.replace(/,/g, "");
  }
  const value = Number(normalised);
  return Number.isFinite(value) ? value : NaN;
}
