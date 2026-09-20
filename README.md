# Home Cost Australia

An independent Australian **home cost & energy** website: browser-based
calculators and source-backed cost guides that help people understand what it
costs to run, repair and improve a home. Built to earn high-value organic
traffic and monetise sustainably with Google AdSense — **without** invented
data, thin programmatic pages, or paid-traffic arbitrage.

> **Working name only.** `Home Cost Australia` is provisional. The brand, domain,
> logo, email and legal details are centralised in config and can change without
> editing many files. No real domains, credentials, people or company details are
> invented anywhere in this repo.

## Architecture

- **Next.js 16 (App Router)** with **React 19**, **TypeScript strict**, **Tailwind CSS 4.3**.
- **Server Components by default**; Client Components only where there is real
  interaction (calculators, search, the mobile menu, the consent banner).
- **Content engine:** page metadata lives in a typed, validated content registry
  (`src/lib/content/registry.ts`); page bodies are server components composed only
  from a whitelisted set of content components (no raw HTML/scripts in content).
- **Data & traceability:** every market figure is a Zod-validated record in
  `src/data` tracing to a dated source in `src/data/sources/registry.ts`.
- **Calculators:** pure formula functions in `src/lib/calculators` (unit-tested),
  separated from their UI in `src/components/calculator`.
- **SEO:** per-page metadata + canonicals, `sitemap.xml`, `robots.txt`, JSON-LD
  (Organization/WebSite/Article/BreadcrumbList/WebApplication), OG image.
- **Ads & analytics:** fully decoupled and **disabled by default**; the site is
  100% functional without them.

```
src/
  app/                 App Router routes (pages, sitemap, robots, ads.txt, OG image)
  components/          ads/ analytics/ calculator/ content/ layout/ seo/ templates/ ui/
  config/              site.ts (brand/domain/integrations), navigation.ts
  content/ (lib)       registry.ts, states.ts, search-index.ts, source-usage.ts
  data/                costs/  programs/  sources/   (Zod-validated datasets)
  lib/                 analytics/ calculators/ content/ seo/ validation/ format.ts
  styles/              globals.css (design tokens)
scripts/               data-audit, links-check, prelaunch-check
tests/                 unit/ (Vitest)  e2e/ (Playwright + axe)
```

## Requirements

- **Node.js 24 LTS** recommended (works on Node 22+). See `.nvmrc`.
- **pnpm** (a `packageManager` field pins the version; `corepack enable` works too).

## Local setup

```bash
pnpm install
cp .env.example .env.local   # optional; the site builds with everything blank
pnpm dev                     # http://localhost:3000
```

## Environment variables

All are optional; blank values degrade cleanly (ads/analytics simply "off").
See `.env.example` for the full annotated list. Key ones:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (canonicals, sitemap, OG). |
| `NEXT_PUBLIC_SITE_NAME` | Provisional brand name. |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-XXXXXXXXXXXXXXXX` — leave blank until approved. |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | `true` **and** a real client id are both required for ads to render. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` — blank = analytics off. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console verification token. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact email. |
| `PUBLISHER_LEGAL_NAME` | Legal entity for legal pages/schema. |
| `REQUIRE_LEGAL_COMPLETE` / `PRELAUNCH_STRICT` | Make `prelaunch:check` fail on placeholders. |

## Editing content

### Add or edit a page

1. Add/adjust its entry in `src/lib/content/registry.ts` (title, description,
   dates, `sourceIds`, `index`). This drives metadata, sitemap and search.
2. Create the route at `src/app/<slug>/page.tsx`, using a template
   (`ArticleLayout`, `HubLayout`, `CalculatorPageLayout` or `TrustLayout`) and
   only the whitelisted content components (`CostRangeCard`, `DataTable`,
   `SourceBadge`, `Callout`, `Checklist`, …).
3. `pnpm build` (fails if a slug/title/description is duplicated) and
   `pnpm links:check`.

### Add or update a source and cost datum

1. Add the source once in `src/data/sources/registry.ts` (organisation, URL,
   type, `checkedAt`). Never invent a URL or date.
2. Add the figure in `src/data/costs/index.ts` with its **scope**,
   `includes`/`excludes`, `sourceId`, `sourceDate`, `checkedAt`, `confidence`.
   Never store only low/high without context, and never blend different scopes.
3. Reference the datum from a page via `<CostRangeCard datumId="…" />`.

### Create a calculator and its tests

1. Write the pure formula in `src/lib/calculators/<name>.ts` (no UI).
2. Add unit tests in `tests/unit/calculators.test.ts` (fixtures + edge cases).
3. Build the UI in `src/components/calculator/tools/<Name>Calculator.tsx` using
   `CalcFrame` and the field components.
4. Register metadata in `src/lib/calculators/registry.ts` and add a content
   registry entry + route page.

### Change the provisional brand/domain

Edit `src/config/site.ts` inputs (via env) — `siteName`, `siteUrl`,
`contactEmail`, `publisherLegalName`. The logo is a CSS/SVG wordmark built from
config, so there is no raster asset to swap. Do external trademark/domain checks
yourself; this project never asserts domain availability.

## Search Console

1. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (adds the verification meta tag), or
   verify by DNS.
2. Submit `https://<your-domain>/sitemap.xml`.
3. Inspect the homepage, hubs and calculators after launch. See the operating
   playbook in the master spec (§58).

## Enable GA4

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Analytics are **consent-gated**: nothing
loads until the visitor accepts, IP anonymisation is on, and ad-personalisation
storage stays denied. First-party events are defined in
`src/lib/analytics/events.ts` (no `ad_clicked` event, ever).

## Consent / CMP (EEA, UK, Switzerland)

The built-in banner governs first-party analytics only. Serving **personalised
ads** to EEA/UK/Switzerland visitors requires a **certified** CMP integrated with
the IAB TCF and Google (e.g. **Google Privacy & Messaging**). Connect one before
enabling AdSense for those regions. Do **not** relabel the built-in banner as
"certified".

## Enable AdSense (after approval)

1. Get approved and obtain your `ca-pub-…` id.
2. Set `NEXT_PUBLIC_ADSENSE_CLIENT` and `NEXT_PUBLIC_ADSENSE_ENABLED=true`.
3. Ads render via `<AdSlot placement="…" />` (reserved height, conservative
   placement, never near calculator controls). Swapping ad networks later means
   changing `AdSlot` only.
4. **ads.txt:** `/ads.txt` auto-emits the exact `google.com … DIRECT …` line for
   your publisher once the client id is set. Never add an invented line.
5. **Never test by clicking live ads.** Use development placeholders
   (`NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS=true`) and Google's approved tools only.

## Security headers

`next.config.ts` sets a baseline CSP (compatible with Google Analytics/AdSense),
`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and a
`Permissions-Policy`. The CSP allows inline scripts/styles as a pragmatic
baseline; before a hardened launch, move to a **nonce-based CSP**.

## Data freshness

`pnpm data:audit` lists records due for review by category cadence (programs
monthly, solar/battery quarterly, trades/renovations 6-monthly). Updates should
be reviewable in a git diff — never scraped opaquely.

## Quality gate (Definition of Done)

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm data:audit
pnpm links:check
pnpm prelaunch:check
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests, build and the
data/links checks on every push/PR; e2e runs in a separate job.

## Prelaunch & deploy checklist

Optimised for Vercel but not coupled to it (standard `next build`/`next start`).
Before the first indexable production deploy:

1. Set a real `NEXT_PUBLIC_SITE_URL` (HTTPS, single canonical host; redirect the other).
2. Complete legal owner/contact details and run `REQUIRE_LEGAL_COMPLETE=true PRELAUNCH_STRICT=true pnpm prelaunch:check`.
3. Keep AdSense **off** until your account flow says ready.
4. Enable GA4 only if configured; test consent behaviour by region.
5. Create the Search Console property and submit the sitemap.
6. Confirm `robots.txt`, `sitemap.xml` and `ads.txt` respond correctly; test 404.
7. Run Lighthouse on mobile templates; check the print view of a calculator.
8. Verify no secrets are bundled client-side.

## License / usage

Content and data compilations are the project's own; cited third-party figures
belong to their sources (see `/sources`). Do not republish competitor content.
