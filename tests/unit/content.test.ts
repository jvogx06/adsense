import { describe, it, expect } from "vitest";
import { content, indexableContent, recentlyUpdated } from "@/lib/content/registry";
import { calculators } from "@/lib/calculators/registry";
import { resolveToSourceIds } from "@/lib/content/source-usage";
import { getSource } from "@/data/sources/registry";

describe("content registry", () => {
  it("has unique slugs, meta titles and descriptions", () => {
    const slugs = content.map((c) => c.slug);
    const titles = content.map((c) => c.metaTitle);
    const descriptions = content.map((c) => c.description);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("every indexable entry has title, description and dates", () => {
    for (const e of indexableContent()) {
      expect(e.title.length, e.slug).toBeGreaterThan(0);
      expect(e.description.length, e.slug).toBeGreaterThan(0);
      expect(e.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("guides that display market numbers cite a resolvable source", () => {
    // Pages that publish a sourced figure must trace it; framework/comparison
    // guides that deliberately avoid inventing a number legitimately have none.
    const mustCite = [
      "/renovations/bathroom-renovation-cost",
      "/renovations/kitchen-renovation-cost",
      "/renovations/roof-restoration-cost",
      "/renovations/roof-replacement-cost",
      "/trades/plumber-cost",
      "/trades/electrician-cost",
      "/solar-batteries/solar-battery-cost",
    ];
    for (const slug of mustCite) {
      const entry = content.find((c) => c.slug === slug)!;
      const resolved = resolveToSourceIds(entry.sourceIds);
      expect(resolved.length, `${slug} should cite a source`).toBeGreaterThan(0);
      for (const id of resolved) expect(getSource(id), id).toBeDefined();
    }
  });

  it("every referenced source id resolves to a real source", () => {
    for (const e of content) {
      for (const id of resolveToSourceIds(e.sourceIds)) {
        expect(getSource(id), `${e.slug}:${id}`).toBeDefined();
      }
    }
  });

  it("state jurisdiction pages are noindex until differentiated", () => {
    const stateJurisdictions = content.filter(
      (c) => c.category === "states" && c.slug !== "/states",
    );
    expect(stateJurisdictions.length).toBe(8);
    for (const e of stateJurisdictions) expect(e.index).toBe(false);
  });

  it("Recently Updated surfaces only editorial pages, never legal/trust/config", () => {
    const excluded = new Set(["trust", "legal", "site", "states"]);
    const recent = recentlyUpdated(20);
    expect(recent.length).toBeGreaterThan(0);
    for (const e of recent) {
      expect(excluded.has(e.category), `${e.slug} should not appear`).toBe(false);
    }
    const slugs = recent.map((e) => e.slug);
    expect(slugs).not.toContain("/privacy-policy");
    expect(slugs).not.toContain("/about");
    expect(slugs).not.toContain("/methodology");
  });

  it("every calculator route exists in the content registry", () => {
    const slugs = new Set(content.map((c) => c.slug));
    for (const c of calculators) {
      expect(slugs.has(c.route), c.route).toBe(true);
    }
  });
});
