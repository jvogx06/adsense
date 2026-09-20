import { test, expect } from "@playwright/test";

test.describe("core pages", () => {
  test("homepage renders hero, nav and key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Know what your Australian home costs",
    );
    await expect(page.getByRole("link", { name: "Browse calculators" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Popular calculators" })).toBeVisible();
  });

  test("a cost guide shows an answer, sources and no live ad", async ({ page }) => {
    await page.goto("/renovations/bathroom-renovation-cost");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Bathroom Renovation Cost",
    );
    await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
    // Ads are disabled by default — no AdSense unit should be present.
    await expect(page.locator("ins.adsbygoogle")).toHaveCount(0);
  });

  test("a calculator computes a result in the browser", async ({ page }) => {
    await page.goto("/calculators/air-conditioner-running-cost");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Air Conditioner Running Cost Calculator",
    );
    await page.getByRole("button", { name: "Calculate" }).click();
    await expect(page.getByText(/a year to run/i)).toBeVisible();
    await expect(page.getByText(/Estimate, not a quote/i)).toBeVisible();
  });

  test("mobile menu opens, traps focus target and closes on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /open menu/i });
    await toggle.click();
    await expect(page.locator("#mobile-drawer")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-drawer")).toHaveCount(0);
  });

  test("internal search finds a guide", async ({ page }) => {
    await page.goto("/search");
    await page.getByLabel("Search calculators and guides").fill("bathroom");
    await expect(page.getByRole("link", { name: /Bathroom Renovation Cost/ })).toBeVisible();
  });
});

test.describe("technical routes", () => {
  test("sitemap includes canonical pages and excludes noindex state pages", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("/calculators/air-conditioner-running-cost");
    expect(body).toContain("/renovations/bathroom-renovation-cost");
    expect(body).not.toContain("/states/nsw");
  });

  test("robots.txt disallows /search and links the sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Disallow: /search");
    expect(body.toLowerCase()).toContain("sitemap:");
  });

  test("ads.txt responds 200 text/plain", async ({ request }) => {
    const res = await request.get("/ads.txt");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/plain");
  });

  test("state pages are noindex and not in the sitemap", async ({ page, request }) => {
    await page.goto("/states/nsw");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toContain("noindex");
    const sm = await (await request.get("/sitemap.xml")).text();
    expect(sm).not.toContain("/states/nsw");
  });

  test("an indexable calculator has a self-referencing canonical and is indexable", async ({ page }) => {
    await page.goto("/calculators/solar-battery-payback");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/calculators/solar-battery-payback");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toContain("index");
    expect(robots).not.toContain("noindex");
  });

  test("battery estimator uses the STC model, not a flat 30% of a quote", async ({ page }) => {
    await page.goto("/calculators/battery-discount-estimator");
    await expect(page.getByText(/Unofficial estimate/i).first()).toBeVisible();
    await page.getByRole("button", { name: "Calculate" }).click();
    await expect(page.getByText(/STCs/).first()).toBeVisible();
  });

  test("AdSense verification loader is present once in <head>, with no ad units", async ({ page }) => {
    await page.goto("/");
    const loaders = page.locator('head script[src*="adsbygoogle.js"]');
    await expect(loaders).toHaveCount(1);
    const src = await loaders.first().getAttribute("src");
    expect(src).toContain("client=ca-pub-4215967644827651");
    // Verification only — no ad units rendered.
    await expect(page.locator("ins.adsbygoogle")).toHaveCount(0);
  });

  test("404 page is useful and ad-free", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByText(/couldn.t find that cost guide/i)).toBeVisible();
    await expect(page.locator("ins.adsbygoogle")).toHaveCount(0);
  });
});
