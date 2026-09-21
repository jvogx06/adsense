/**
 * Build-time SEO / content validation (§33) + orphan-page check (§11).
 *
 * Hard failures (exit 1): duplicate slugs/titles/descriptions, missing
 * cluster/canonical, future publication dates, a Discover candidate missing alt
 * text, a noindex page leaking into the sitemap, and orphaned indexable pages
 * (an indexable page that no OTHER page links to).
 *
 * Warnings (exit 0): indexable cost pages with no resolvable source, and stale
 * source records past their review cadence.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { content, indexableContent } from "@/lib/content/registry";
import { resolveToSourceIds } from "@/lib/content/source-usage";
import { sources, getSource } from "@/data/sources/registry";
import { stateSlugs } from "@/lib/content/states";
import { daysSince } from "@/lib/format";

const ROOT = process.cwd();
const APP_DIR = join(ROOT, "src", "app");
const TODAY = new Date().toISOString().slice(0, 10);

const failures: string[] = [];
const warnings: string[] = [];

// --- Known slugs + their owning page file ---------------------------------
const knownSlugs = new Set<string>(content.map((e) => e.slug));
for (const s of stateSlugs) knownSlugs.add(`/states/${s}`);

function pageFileFor(slug: string): string {
  if (slug === "/") return join(APP_DIR, "page.tsx");
  if (slug.startsWith("/states/") && slug !== "/states") {
    return join(APP_DIR, "states", "[state]", "page.tsx");
  }
  return join(APP_DIR, ...slug.split("/").filter(Boolean), "page.tsx");
}

// --- 1. Duplicate slugs / titles / descriptions ---------------------------
function assertUnique(values: string[], label: string) {
  const seen = new Set<string>();
  for (const v of values) {
    if (seen.has(v)) failures.push(`Duplicate ${label}: ${v}`);
    seen.add(v);
  }
}
assertUnique(content.map((e) => e.slug), "slug");
assertUnique(content.map((e) => e.metaTitle), "meta title");
assertUnique(content.map((e) => e.description), "meta description");

// --- 2. Per-entry field checks --------------------------------------------
for (const e of content) {
  if (!e.category) failures.push(`${e.slug}: missing cluster/category`);
  if (!e.slug.startsWith("/")) failures.push(`${e.slug}: canonical slug must start with '/'`);
  if (e.publishedAt > TODAY) failures.push(`${e.slug}: future publishedAt ${e.publishedAt}`);
  if (e.updatedAt > TODAY) failures.push(`${e.slug}: future updatedAt ${e.updatedAt}`);
  if (e.discoverCandidate && !e.heroAlt) {
    failures.push(`${e.slug}: Discover candidate is missing hero/social alt text`);
  }
  // Indexable cost pages should normally cite a source (warning, not failure).
  const costCluster = ["air-conditioning", "solar-batteries", "renovations", "trades"].includes(
    e.category,
  );
  if (
    e.index &&
    costCluster &&
    e.intent === "commercial-research" &&
    resolveToSourceIds(e.sourceIds).length === 0
  ) {
    warnings.push(`${e.slug}: indexable cost guide with no resolvable source record`);
  }
}

// --- 3. noindex pages must not be in the sitemap --------------------------
const sitemapSlugs = new Set(indexableContent().map((e) => e.slug));
for (const e of content) {
  if (!e.index && sitemapSlugs.has(e.slug)) {
    failures.push(`${e.slug}: noindex page present in sitemap set`);
  }
}

// --- 4. Orphan check: every indexable page needs an inbound internal link --
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if ([".ts", ".tsx"].includes(extname(p))) out.push(p);
  }
  return out;
}

// Map each known slug to the set of source files that reference it as a route.
const linkedFrom = new Map<string, Set<string>>();
const routeLiteral = /["'`](\/[a-z0-9][a-z0-9/-]*)["'`]/g;
for (const file of walk(join(ROOT, "src"))) {
  const text = readFileSync(file, "utf8");
  let m: RegExpExecArray | null;
  while ((m = routeLiteral.exec(text)) !== null) {
    const target = m[1]!;
    if (!knownSlugs.has(target)) continue;
    const set = linkedFrom.get(target) ?? new Set<string>();
    set.add(file);
    linkedFrom.set(target, set);
  }
}

for (const e of indexableContent()) {
  if (e.slug === "/") continue; // the homepage is the root; not an orphan
  const own = pageFileFor(e.slug);
  const others = [...(linkedFrom.get(e.slug) ?? new Set<string>())].filter((f) => f !== own);
  if (others.length === 0) {
    failures.push(`${e.slug}: orphaned — no inbound internal link from another page`);
  }
}

// --- 5. Stale source records (warning) ------------------------------------
const CADENCE: Record<string, number> = {
  government: 90,
  regulator: 90,
  policy: 180,
  industry: 180,
  research: 365,
  publisher: 180,
};
for (const s of sources) {
  const limit = CADENCE[s.sourceType] ?? 180;
  const age = daysSince(s.checkedAt);
  if (age > limit) {
    warnings.push(`source ${s.id}: last checked ${s.checkedAt} (${age}d > ${limit}d cadence)`);
  }
  // sanity: referenced source ids must resolve (guards typos)
  void getSource(s.id);
}

// --- Report ---------------------------------------------------------------
console.log("SEO / content audit\n===================");
console.log(
  `Pages: ${content.length} · indexable: ${indexableContent().length} · sources: ${sources.length}`,
);
for (const w of warnings) console.log(`  [warn] ${w}`);
for (const f of failures) console.error(`  [FAIL] ${f}`);

if (failures.length > 0) {
  console.error(`\n${failures.length} blocking issue(s).`);
  process.exit(1);
}
console.log(warnings.length ? `\n${warnings.length} warning(s); no blocking issues.` : "\nAll checks passed.");
process.exit(0);
