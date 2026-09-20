/**
 * Prelaunch / production configuration check (P0 §3 / §6).
 *
 * - On a real production deployment (siteEnv === "production") the required
 *   owner details MUST be present, or this fails — an explicit configuration
 *   error rather than a half-configured public site.
 * - On staging/dev it only warns, so preview builds are never blocked.
 * - Opt-in strict flags let the owner enforce completeness earlier.
 */
import { siteConfig } from "@/config/site";

const requireLegal = process.env.REQUIRE_LEGAL_COMPLETE === "true";
const strict = process.env.PRELAUNCH_STRICT === "true";
// On a declared production deployment, completeness is mandatory.
const hardMode = siteConfig.isProduction || requireLegal || strict;

const warnings: string[] = [];
const failures: string[] = [];

function check(bad: boolean, message: string, hard: boolean) {
  if (!bad) return;
  (hard ? failures : warnings).push(message);
}

check(
  !siteConfig.legalNameConfigured,
  "Legal operator name (PUBLISHER_LEGAL_NAME) is not set.",
  hardMode,
);
check(
  !siteConfig.contactConfigured,
  "Public contact email (NEXT_PUBLIC_CONTACT_EMAIL) is not set.",
  hardMode,
);
check(
  !siteConfig.domainConfigured,
  "Production domain (NEXT_PUBLIC_SITE_URL) still points at example.com.",
  hardMode,
);

// AdSense: never ship a fake / malformed publisher id.
check(
  Boolean(siteConfig.adsenseClient) &&
    !/^ca-pub-\d{16}$/.test(siteConfig.adsenseClient ?? ""),
  `NEXT_PUBLIC_ADSENSE_CLIENT "${siteConfig.adsenseClient}" is not a valid ca-pub-XXXXXXXXXXXXXXXX id.`,
  true,
);

console.log("Prelaunch check\n===============");
console.log(
  `Env: ${siteConfig.siteEnv} · production=${siteConfig.isProduction} · analytics=${siteConfig.analyticsEnabled} · adsense=${siteConfig.adsenseEnabled}`,
);

for (const w of warnings) console.log(`  [warn] ${w}`);
for (const f of failures) console.error(`  [FAIL] ${f}`);

if (failures.length > 0) {
  console.error(
    `\n${failures.length} blocking issue(s). Complete these before production launch.`,
  );
  process.exit(1);
}
console.log(
  warnings.length > 0
    ? "\nWarnings only — safe for preview/staging."
    : "\nAll prelaunch checks passed.",
);
process.exit(0);
