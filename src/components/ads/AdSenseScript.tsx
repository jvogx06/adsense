import { siteConfig } from "@/config/site";

/**
 * Google AdSense account / site-verification loader.
 *
 * Loads `adsbygoogle.js` exactly once for the configured publisher id. This is
 * the script Google uses to verify site ownership and review the site, so it
 * loads whenever a valid publisher id is present and we are not in local
 * development (see `adsenseScriptEnabled`) — independent of whether ad UNITS are
 * enabled. It renders no ad units and does not enable Auto Ads by itself.
 *
 * Rendered as a plain `<script async src>`: React 19 hoists it into <head> and
 * deduplicates it by `src`, so including it once in the root layout is enough
 * and it can never be double-injected.
 */
export function AdSenseScript() {
  if (!siteConfig.adsenseScriptEnabled || !siteConfig.adsenseClient) return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClient}`}
      crossOrigin="anonymous"
    />
  );
}
