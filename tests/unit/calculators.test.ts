import { describe, it, expect } from "vitest";
import { airConditionerRunningCost } from "@/lib/calculators/air-conditioner";
import { electricityUsage } from "@/lib/calculators/electricity-usage";
import { evChargingCost } from "@/lib/calculators/ev-charging";
import { poolRunningCost } from "@/lib/calculators/pool-running";
import { solarSystemSize } from "@/lib/calculators/solar-system-size";
import { solarBatteryPayback } from "@/lib/calculators/solar-battery-payback";
import { batteryDiscountEstimate } from "@/lib/calculators/battery-discount";
import { renovationBudget } from "@/lib/calculators/renovation-budget";
import { roofReplacementRange } from "@/lib/calculators/roof-replacement";
import { compareQuotes } from "@/lib/calculators/quote-comparison";
import { CalculatorError, parseLooseNumber } from "@/lib/calculators/shared";
import { batteryProgram } from "@/data/programs/battery-program";

describe("air conditioner running cost", () => {
  it("computes a known fixture (input power mode)", () => {
    const r = airConditionerRunningCost({
      ratedInputKW: 1,
      hoursPerDay: 8,
      daysPerWeek: 7,
      weeksPerYear: 52,
      tariffCents: 30,
    });
    expect(r.kWhPerDay).toBeCloseTo(8, 6);
    expect(r.costPerDay).toBeCloseTo(2.4, 6);
    expect(r.kWhPerYear).toBeCloseTo(8 * 364, 6);
    expect(r.costPerYear).toBeCloseTo(873.6, 4);
    expect(r.costPerMonthEquivalent).toBeCloseTo(873.6 / 12, 4);
    expect(r.costPerWeek).toBeCloseTo(16.8, 6);
  });

  it("derives input power from cooling capacity and efficiency ratio", () => {
    const r = airConditionerRunningCost({
      coolingCapacityKW: 7,
      efficiencyRatio: 3,
      hoursPerDay: 5,
      daysPerWeek: 7,
      weeksPerYear: 52,
      tariffCents: 30,
    });
    expect(r.inputKW).toBeCloseTo(7 / 3, 6);
  });

  it("returns zero cost at 0 hours/day and 0 tariff (edge cases)", () => {
    expect(
      airConditionerRunningCost({
        ratedInputKW: 2,
        hoursPerDay: 0,
        daysPerWeek: 7,
        weeksPerYear: 52,
        tariffCents: 30,
      }).costPerYear,
    ).toBe(0);
    expect(
      airConditionerRunningCost({
        ratedInputKW: 2,
        hoursPerDay: 5,
        daysPerWeek: 7,
        weeksPerYear: 52,
        tariffCents: 0,
      }).costPerYear,
    ).toBe(0);
  });

  it("warns on an extremely high tariff without crashing", () => {
    const r = airConditionerRunningCost({
      ratedInputKW: 1,
      hoursPerDay: 1,
      daysPerWeek: 7,
      weeksPerYear: 52,
      tariffCents: 500,
    });
    expect(r.warnings.some((w) => /unusually high/i.test(w))).toBe(true);
  });

  it("throws when neither power nor capacity+efficiency is supplied", () => {
    expect(() =>
      airConditionerRunningCost({
        hoursPerDay: 5,
        daysPerWeek: 7,
        weeksPerYear: 52,
        tariffCents: 30,
      }),
    ).toThrow(CalculatorError);
  });
});

describe("electricity usage", () => {
  it("sums multiple appliances", () => {
    const r = electricityUsage(
      [
        { label: "Fridge", watts: 1000, quantity: 1, hoursPerDay: 5, daysPerWeek: 7 },
        { label: "Heaters", watts: 2000, quantity: 2, hoursPerDay: 2, daysPerWeek: 7 },
      ],
      25,
    );
    expect(r.rows[0]!.kWhPerDay).toBeCloseTo(5, 6);
    expect(r.rows[1]!.kWhPerDay).toBeCloseTo(8, 6);
    expect(r.totalKWhPerDay).toBeCloseTo(13, 6);
    expect(r.totalCostPerDay).toBeCloseTo(3.25, 6);
    expect(r.totalCostPerYear).toBeCloseTo(13 * 7 * 52 * 0.25, 4);
  });
});

describe("ev charging", () => {
  it("applies charging loss and weighted tariff", () => {
    const r = evChargingCost({
      consumptionKWhPer100km: 18,
      kmPerWeek: 250,
      homeTariffCents: 30,
      publicTariffCents: 55,
      homeSharePercent: 80,
      chargingLossPercent: 10,
    });
    expect(r.kmPerYear).toBe(13000);
    expect(r.energyAtBatteryKWhPerYear).toBeCloseTo(2340, 6);
    expect(r.gridKWhPerYear).toBeCloseTo(2600, 6);
    expect(r.weightedTariffAUD).toBeCloseTo(0.35, 6);
    expect(r.annualCostMixed).toBeCloseTo(910, 4);
    expect(r.annualCostHomeOnly).toBeCloseTo(780, 4);
    expect(r.annualCostPublicOnly).toBeCloseTo(1430, 4);
  });

  it("throws when charging losses are 100% (no divide by zero)", () => {
    expect(() =>
      evChargingCost({
        consumptionKWhPer100km: 18,
        kmPerWeek: 250,
        homeTariffCents: 30,
        publicTariffCents: 55,
        homeSharePercent: 80,
        chargingLossPercent: 100,
      }),
    ).toThrow(CalculatorError);
  });
});

describe("pool running cost", () => {
  it("adds pump and heat-pump heater energy", () => {
    const r = poolRunningCost({
      pumpKW: 1,
      pumpHoursPerDay: 8,
      pumpDaysPerYear: 365,
      tariffCents: 30,
      heaterThermalKW: 9,
      heaterCOP: 3,
      heaterHoursPerDay: 4,
      heaterDaysPerYear: 100,
    });
    expect(r.pumpKWhPerYear).toBeCloseTo(2920, 6);
    // heater input = 9/3 = 3 kW; 3 × 4 × 100 = 1200 kWh
    expect(r.heaterKWhPerYear).toBeCloseTo(1200, 6);
    expect(r.totalKWhPerYear).toBeCloseTo(4120, 6);
    expect(r.totalCostPerYear).toBeCloseTo(4120 * 0.3, 4);
  });
});

describe("solar system size", () => {
  it("sizes from daily use, offset, peak sun and loss", () => {
    expect(
      solarSystemSize({ dailyUseKWh: 20, offsetPercent: 100, peakSunHours: 4, lossPercent: 0 })
        .requiredDcKW,
    ).toBeCloseTo(5, 6);
    expect(
      solarSystemSize({ dailyUseKWh: 20, offsetPercent: 100, peakSunHours: 4, lossPercent: 10 })
        .requiredDcKW,
    ).toBeCloseTo(20 / (4 * 0.9), 6);
  });

  it("throws when losses are 100%", () => {
    expect(() =>
      solarSystemSize({ dailyUseKWh: 20, offsetPercent: 100, peakSunHours: 4, lossPercent: 100 }),
    ).toThrow(CalculatorError);
  });
});

describe("solar battery payback", () => {
  it("returns a payback year within tolerance for a normal scenario", () => {
    const r = solarBatteryPayback({
      netInstalledCost: 5000,
      usableKWh: 10,
      roundTripEfficiencyPercent: 100,
      solarSurplusKWhPerDay: 20,
      overnightLoadKWhPerDay: 10,
      importTariffCents: 40,
      feedInTariffCents: 0,
      annualDegradationPercent: 0,
    });
    // 10 kWh × $0.40 × 365 = $1,460/yr → payback ≈ 3.42 years
    expect(r.firstYearNetSavings).toBeCloseTo(1460, 4);
    expect(r.paybackYears).not.toBeNull();
    expect(r.paybackYears!).toBeCloseTo(3.42, 1);
  });

  it("returns null payback when there are no savings (feed-in > import)", () => {
    const r = solarBatteryPayback({
      netInstalledCost: 9000,
      usableKWh: 10,
      roundTripEfficiencyPercent: 100,
      solarSurplusKWhPerDay: 10,
      overnightLoadKWhPerDay: 5,
      importTariffCents: 10,
      feedInTariffCents: 30,
      annualDegradationPercent: 0,
    });
    expect(r.firstYearNetSavings).toBeLessThanOrEqual(0);
    expect(r.paybackYears).toBeNull();
    expect(r.paybackMessage).toMatch(/does not reach positive payback/i);
  });

  it("reports no payback within horizon when savings are too small", () => {
    const r = solarBatteryPayback({
      netInstalledCost: 50000,
      usableKWh: 5,
      roundTripEfficiencyPercent: 90,
      solarSurplusKWhPerDay: 5,
      overnightLoadKWhPerDay: 3,
      importTariffCents: 25,
      feedInTariffCents: 5,
      annualDegradationPercent: 2,
      horizonYears: 15,
    });
    expect(r.paybackYears).toBeNull();
    expect(r.paybackMessage).toMatch(/no payback within/i);
  });
});

describe("federal battery discount estimator", () => {
  it("applies the dated indicative percentage (not hard-coded)", () => {
    const r = batteryDiscountEstimate(
      { usableCapacityKWh: 10, eligibleInstalledQuote: 10000, mode: "indicative" },
      batteryProgram,
    );
    expect(r.isIndicative).toBe(true);
    expect(r.percentApplied).toBe(batteryProgram.indicativeDiscountPercent);
    expect(r.discountAmount).toBeCloseTo(
      10000 * (batteryProgram.indicativeDiscountPercent / 100),
      4,
    );
    expect(r.eligible).toBe(true);
  });

  it("flags ineligible capacity and supports manual mode", () => {
    const r = batteryDiscountEstimate(
      {
        usableCapacityKWh: 250,
        eligibleInstalledQuote: 10000,
        mode: "manual",
        manualDiscountAmount: 2500,
      },
      batteryProgram,
    );
    expect(r.eligible).toBe(false);
    expect(r.isIndicative).toBe(false);
    expect(r.percentApplied).toBeCloseTo(25, 6);
    expect(r.netCostAfterDiscount).toBeCloseTo(7500, 6);
  });
});

describe("renovation budget", () => {
  it("computes low/base/high totals with fixed extras and contingency", () => {
    const r = renovationBudget({
      lineItems: [
        { label: "Demolition", low: 1000, base: 1500, high: 2000 },
        { label: "Tiling", low: 2000, base: 2500, high: 3000 },
      ],
      contingencyPercent: 10,
      professionalFees: 500,
    });
    expect(r.itemsLow).toBe(3000);
    expect(r.itemsBase).toBe(4000);
    expect(r.itemsHigh).toBe(5000);
    expect(r.fixedExtras).toBe(500);
    expect(r.totalLow).toBeCloseTo(3850, 6);
    expect(r.totalBase).toBeCloseTo(4950, 6);
    expect(r.totalHigh).toBeCloseTo(6050, 6);
  });

  it("caps contingency at 50%", () => {
    expect(() =>
      renovationBudget({ lineItems: [], contingencyPercent: 80 }),
    ).toThrow(CalculatorError);
  });
});

describe("roof replacement range", () => {
  it("multiplies area by the source-dated $/m² range", () => {
    const r = roofReplacementRange({ areaM2: 150, lowPerM2: 18, highPerM2: 37 });
    expect(r.low).toBe(2700);
    expect(r.high).toBe(5550);
    expect(r.referenceMidpoint).toBe(4125);
  });
});

describe("quote comparison", () => {
  it("normalises per unit only when all quotes have units, and flags gaps", () => {
    const r = compareQuotes([
      { label: "A", totalCost: 9000, inclusions: ["Removal", "Warranty"], units: 100 },
      { label: "B", totalCost: 8000, inclusions: ["Removal"], units: 100 },
    ]);
    expect(r.canNormalisePerUnit).toBe(true);
    expect(r.rows[0]!.costPerUnit).toBeCloseTo(90, 6);
    expect(r.rows[1]!.missingInclusions).toContain("Warranty");
  });

  it("does not normalise when a quote is missing units", () => {
    const r = compareQuotes([
      { label: "A", totalCost: 9000, inclusions: [], units: 100 },
      { label: "B", totalCost: 8000, inclusions: [] },
    ]);
    expect(r.canNormalisePerUnit).toBe(false);
    expect(r.rows[0]!.costPerUnit).toBeUndefined();
  });
});

describe("loose number parsing (international decimal commas)", () => {
  it("handles comma decimals and thousands separators", () => {
    expect(parseLooseNumber("1,50")).toBeCloseTo(1.5, 6);
    expect(parseLooseNumber("1,234.56")).toBeCloseTo(1234.56, 6);
    expect(parseLooseNumber("1.234,56")).toBeCloseTo(1234.56, 6);
    expect(parseLooseNumber("2000")).toBe(2000);
    expect(Number.isNaN(parseLooseNumber("abc"))).toBe(true);
  });
});
