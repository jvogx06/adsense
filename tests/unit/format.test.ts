import { describe, it, expect } from "vitest";
import {
  formatAUD,
  formatAUDRange,
  formatAUDPerUnitRange,
  formatDate,
  formatKWh,
  formatPercent,
  daysSince,
} from "@/lib/format";

describe("AUD money formatting", () => {
  it("formats whole dollars without cents and with thousands separators", () => {
    expect(formatAUD(1250)).toBe("A$1,250");
    expect(formatAUD(35000)).toBe("A$35,000");
  });

  it("keeps two decimals for non-whole amounts", () => {
    expect(formatAUD(1250.5)).toBe("A$1,250.50");
    expect(formatAUD(2.4)).toBe("A$2.40");
  });

  it("supports the plain $ symbol", () => {
    expect(formatAUD(1250, { symbol: "$" })).toBe("$1,250");
  });

  it("formats ranges", () => {
    expect(formatAUDRange(8000, 35000)).toBe("A$8,000–A$35,000");
    expect(formatAUDRange(35000, undefined)).toBe("A$35,000+");
    expect(formatAUDPerUnitRange(18, 37, "m²")).toBe("A$18–A$37/m²");
  });
});

describe("date formatting", () => {
  it("formats full, month and year-only ISO dates", () => {
    expect(formatDate("2026-09-20")).toBe("20 September 2026");
    expect(formatDate("2026-05")).toBe("May 2026");
    expect(formatDate("2026")).toBe("2026");
  });
});

describe("units", () => {
  it("formats kWh with magnitude-based precision", () => {
    expect(formatKWh(2912)).toBe("2,912 kWh");
    expect(formatKWh(8)).toBe("8 kWh");
  });
  it("formats percentages", () => {
    expect(formatPercent(30)).toBe("30%");
  });
});

describe("daysSince", () => {
  it("counts days between an ISO date and a reference date", () => {
    expect(daysSince("2026-01-01", new Date("2026-01-31T00:00:00Z"))).toBe(30);
  });
});
