import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdSlot } from "@/components/ads/AdSlot";
import { CostRangeCard } from "@/components/content/CostRangeCard";
import { AirConditionerCalculator } from "@/components/calculator/tools/AirConditionerCalculator";

describe("AdSlot", () => {
  it("renders nothing when ads are disabled (the default)", () => {
    const { container } = render(<AdSlot placement="article-mid-1" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("CostRangeCard", () => {
  it("renders a sourced value with its metric", () => {
    render(<CostRangeCard datumId="plumber-hourly" />);
    expect(screen.getByText("Plumber hourly rate")).toBeInTheDocument();
    expect(screen.getByText("A$80–A$200/hour")).toBeInTheDocument();
    expect(screen.getByText(/Source: hipages/)).toBeInTheDocument();
  });
});

describe("AirConditionerCalculator", () => {
  it("computes a result from the default inputs on Calculate", () => {
    render(<AirConditionerCalculator />);
    fireEvent.click(screen.getByRole("button", { name: "Calculate" }));
    // Defaults: 1 kW, 8 h/day, 7 days, 52 weeks, 30 c/kWh => ~A$874/year.
    expect(screen.getByText(/a year to run/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimate, not a quote/i)).toBeInTheDocument();
  });
});
