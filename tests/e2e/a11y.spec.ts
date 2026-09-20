import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility smoke (spec §17/§26/§38.1): no critical/serious axe violations on
 * the homepage, a cost guide and a calculator. WCAG 2.1 A/AA rule sets.
 */
const pages = [
  { name: "homepage", path: "/" },
  { name: "cost guide", path: "/renovations/bathroom-renovation-cost" },
  { name: "calculator", path: "/calculators/air-conditioner-running-cost" },
];

for (const p of pages) {
  test(`no serious/critical a11y violations: ${p.name}`, async ({ page }) => {
    await page.goto(p.path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      serious,
      serious.map((v) => `${v.id}: ${v.help}`).join("\n"),
    ).toEqual([]);
  });
}
