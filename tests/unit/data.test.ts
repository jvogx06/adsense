import { describe, it, expect } from "vitest";
import { sources, getSource } from "@/data/sources/registry";
import { costData } from "@/data/costs/index";
import { batteryProgram, isProgramActive } from "@/data/programs/battery-program";

describe("source registry", () => {
  it("has no duplicate source ids", () => {
    const ids = sources.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every cost datum references an existing source id", () => {
    for (const datum of costData) {
      expect(getSource(datum.sourceId), `source for ${datum.id}`).toBeDefined();
    }
  });

  it("every cost datum has scope and at least one figure", () => {
    for (const datum of costData) {
      expect(datum.scope.length).toBeGreaterThan(0);
      const hasFigure =
        datum.low !== undefined ||
        datum.typical !== undefined ||
        datum.high !== undefined;
      expect(hasFigure, `figure for ${datum.id}`).toBe(true);
    }
  });
});

describe("battery program dataset", () => {
  it("does not hard-code a permanent number and stays dated", () => {
    expect(batteryProgram.indicativeDiscountPercent).toBeGreaterThan(0);
    expect(batteryProgram.effectiveFrom).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(batteryProgram.sourceIds.length).toBeGreaterThan(0);
  });

  it("is active on a date within its effective window", () => {
    expect(isProgramActive(batteryProgram, new Date("2026-09-20T00:00:00Z"))).toBe(true);
    expect(isProgramActive(batteryProgram, new Date("2026-01-01T00:00:00Z"))).toBe(false);
  });
});
