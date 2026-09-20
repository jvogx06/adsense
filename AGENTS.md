# AGENTS.md — rules for future code agents

This project is a source-backed Australian home-cost site monetised (later) with
AdSense. These rules protect its accuracy, trust and search standing. **Do not
break them**, even to "add more content" or "show more ads".

## Non-negotiable rules

1. **Never invent market data.** No price, rate, rebate, volume or legal
   requirement without a dated record in `src/data/sources/registry.ts` and a
   figure in `src/data`. If no source exists, use a formula + user input +
   sourced qualitative text, or leave the number out.
2. **Never invent credentials, people, addresses, testimonials, reviews,
   certifications or domain availability.** No fake "expert reviewed" — set
   `reviewerId: null` unless a real, named reviewer reviewed that page.
3. **Australian English** everywhere (metre, labour, licence (noun), organise,
   colour, centre); currency AUD, shown as `A$` in calculator results.
4. **Preserve source scope.** Never blend different scopes (material-only vs
   installed, repair vs restoration, average vs range) into a fabricated
   average. Show each figure with its scope, date and source.
5. **Don't say "average"** when a source publishes a range/ballpark — keep the
   source's own wording.
6. **No thin/mass-generated pages.** Never create `/city/service` variants or
   clone national text with a state name swapped in. State pages stay `noindex`
   until they carry verified, differentiated data.
7. **Ads never near interactive controls.** No ad between a calculator's last
   input and its Calculate button, or pinned to the primary result. No text or
   arrows encouraging clicks. No auto-refresh. No `ad_clicked` event. Ads are
   controlled by `<AdSlot>`/config, never by content files.
8. **Keep calculators tested.** Every formula lives in `src/lib/calculators`
   (pure, no UI) with unit tests, including edge cases (0 hours, 0 tariff,
   divide-by-zero, no-payback → null).
9. **Preserve URL/canonical integrity.** Lowercase kebab-case slugs, no dates in
   slugs, self-referencing canonicals, `noindex,follow` for `/search`. A slug
   change needs a 301 and sitemap/internal-link updates.
10. **AdSense/GA stay disabled and decoupled** until real ids exist. Never commit
    a fake `ca-pub-…`. The site must build and work with everything blank.
11. **Only Google-documented schema.** No HowTo/FAQ rich-result markup as an SEO
    tactic; don't promise a rich result Google doesn't document.
12. **Run every check before commit:** `pnpm lint && pnpm typecheck && pnpm test
    && pnpm build && pnpm data:audit && pnpm links:check && pnpm prelaunch:check`
    (and `pnpm test:e2e` for UI changes).

## Conflict priority (spec §70)

Accuracy & policy compliance → user utility → crawlability/performance/a11y →
sustainable SEO → ad revenue → visual flourish. If an ad harms calculator UX,
remove it. If a keyword needs unverified data, don't invent it. If a local page
would be thin, don't index it.

## Where things live

- Brand/domain/integrations: `src/config/site.ts` (never hard-code these).
- Page metadata: `src/lib/content/registry.ts` (unique title/description/slug).
- Sources & figures: `src/data/sources`, `src/data/costs`, `src/data/programs`.
- Calculator formulas: `src/lib/calculators`; UIs: `src/components/calculator`.
- Templates: `src/components/templates`; content blocks: `src/components/content`.
