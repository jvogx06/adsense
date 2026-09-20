/**
 * Internal link + route integrity check (spec §38 "no known broken routes").
 *
 * 1. Every content-registry slug must have a matching App Router route.
 * 2. Every internal `href` literal in source must resolve to a known route.
 * Exits non-zero on any broken link or missing route.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { content } from "@/lib/content/registry";
import { stateSlugs } from "@/lib/content/states";

const ROOT = process.cwd();
const APP_DIR = join(ROOT, "src", "app");

// Known, valid routes.
const knownRoutes = new Set<string>(["/", "/search"]);
for (const e of content) knownRoutes.add(e.slug);
for (const s of stateSlugs) knownRoutes.add(`/states/${s}`);
// Metadata/asset routes that are valid targets but not "pages".
const assetRoutes = new Set(["/opengraph-image", "/sitemap.xml", "/robots.txt", "/ads.txt"]);

const errors: string[] = [];

// 1. Every content slug resolves to a route file (or the dynamic state route).
for (const e of content) {
  if (e.slug === "/") {
    if (!existsSync(join(APP_DIR, "page.tsx"))) errors.push(`Missing route file for "/"`);
    continue;
  }
  if (e.category === "states" && e.slug !== "/states") {
    const seg = e.slug.split("/").pop()!;
    if (!stateSlugs.includes(seg)) errors.push(`State slug ${e.slug} not in stateContexts`);
    if (!existsSync(join(APP_DIR, "states", "[state]", "page.tsx"))) {
      errors.push(`Missing dynamic state route for ${e.slug}`);
    }
    continue;
  }
  const file = join(APP_DIR, ...e.slug.split("/").filter(Boolean), "page.tsx");
  if (!existsSync(file)) errors.push(`Missing route file for ${e.slug} (${file})`);
}

// 2. Scan source for internal href literals and validate them.
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

const hrefPattern = /href(?:=|:\s*)["'](\/[^"'#?]*)["']/g;
let hrefCount = 0;
for (const file of walk(join(ROOT, "src"))) {
  const text = readFileSync(file, "utf8");
  let m: RegExpExecArray | null;
  while ((m = hrefPattern.exec(text)) !== null) {
    const raw = m[1]!;
    const route = raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;
    hrefCount++;
    if (!knownRoutes.has(route) && !assetRoutes.has(route)) {
      errors.push(`Broken internal link "${raw}" in ${file.replace(ROOT + "/", "")}`);
    }
  }
}

console.log(`Links check\n===========`);
console.log(`Known routes: ${knownRoutes.size} · href literals scanned: ${hrefCount}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("\nAll internal links and routes resolve.");
process.exit(0);
