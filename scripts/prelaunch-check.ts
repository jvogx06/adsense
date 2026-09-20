/**
 * Prelaunch placeholder check (spec §19.3 / §61).
 *
 * Warns about unfinished owner details by default. Fails the build only when the
 * owner opts in via env flags, so preview/staging is never blocked:
 *  - REQUIRE_LEGAL_COMPLETE=true  → legal owner/contact placeholders must be filled.
 *  - PRELAUNCH_STRICT=true        → example.com must be replaced with the real origin.
 */
import { siteConfig } from "@/config/site";

const requireLegal = process.env.REQUIRE_LEGAL_COMPLETE === "true";
const strict = process.env.PRELAUNCH_STRICT === "true";

const warnings: string[] = [];
const failures: string[] = [];

function check(condition: boolean, message: string, hard: boolean) {
  if (!condition) return;
  if (hard) failures.push(message);
  else warnings.push(message);
}

// Legal / owner details.
check(
  siteConfig.publisherLegalName.startsWith("{{"),
  "PUBLISHER_LEGAL_NAME is not set (legal pages show a placeholder).",
  requireLegal,
);
check(
  siteConfig.contactEmail.length === 0,
  "NEXT_PUBLIC_CONTACT_EMAIL is not set (contact/corrections show a placeholder).",
  requireLegal,
);

// Domain / origin.
check(
  siteConfig.siteUrl.includes("example.com"),
  "NEXT_PUBLIC_SITE_URL still points at example.com.",
  strict,
);

// AdSense sanity: never ship a fake publisher id.
check(
  Boolean(siteConfig.adsenseClient) && !/^ca-pub-\d{16}$/.test(siteConfig.adsenseClient ?? ""),
  `NEXT_PUBLIC_ADSENSE_CLIENT "${siteConfig.adsenseClient}" is not a valid ca-pub-XXXXXXXXXXXXXXXX id.`,
  true,
);

console.log("Prelaunch check\n===============");
console.log(`Mode: REQUIRE_LEGAL_COMPLETE=${requireLegal} PRELAUNCH_STRICT=${strict}`);

for (const w of warnings) console.log(`  [warn] ${w}`);
for (const f of failures) console.error(`  [FAIL] ${f}`);

if (failures.length > 0) {
  console.error(`\n${failures.length} blocking issue(s). Complete these before production launch.`);
  process.exit(1);
}
console.log(
  warnings.length > 0
    ? "\nWarnings only — safe for preview/staging. Complete before production."
    : "\nAll prelaunch checks passed.",
);
process.exit(0);
