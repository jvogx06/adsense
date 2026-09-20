import { CalculatorError, assertNonNegative, assertPositive } from "./shared";

export interface SolarSystemSizeInput {
  dailyUseKWh: number;
  /** Desired offset of daily use, 0–100(+)%. */
  offsetPercent: number;
  /** User-entered peak-sun-hours for their location (no invented default). */
  peakSunHours: number;
  /** System losses as a percentage, 0–<100. */
  lossPercent: number;
}

export interface SolarSystemSizeResult {
  requiredDcKW: number;
  targetDailyGenerationKWh: number;
  warnings: string[];
}

/**
 * Solar system size (spec §12).
 * Required DC kW = daily_use × offset / (peak_sun_hours × (1 - loss)).
 * No city irradiance value is invented — the user supplies peak-sun-hours.
 */
export function solarSystemSize(
  input: SolarSystemSizeInput,
): SolarSystemSizeResult {
  const warnings: string[] = [
    "Peak-sun-hours vary by location and season. Enter a value for your own area and a solar installer can refine it.",
  ];

  const dailyUse = assertNonNegative(input.dailyUseKWh, "daily electricity use (kWh)");
  const offset = assertNonNegative(input.offsetPercent, "desired offset (%)");
  const peakSunHours = assertPositive(input.peakSunHours, "peak-sun-hours");
  const loss = assertNonNegative(input.lossPercent, "system losses (%)");
  if (loss >= 100) {
    throw new CalculatorError("System losses must be less than 100%.");
  }
  if (offset > 200) {
    warnings.push("An offset above 100% sizes the system to generate more than your use.");
  }

  const targetDailyGenerationKWh = dailyUse * (offset / 100);
  const requiredDcKW = targetDailyGenerationKWh / (peakSunHours * (1 - loss / 100));

  return { requiredDcKW, targetDailyGenerationKWh, warnings };
}
