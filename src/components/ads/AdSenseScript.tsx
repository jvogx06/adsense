import Script from "next/script";
import { siteConfig } from "@/config/site";

/**
 * Loads the AdSense library exactly once, and only when ads are enabled with a
 * real publisher id (spec §18.1). Renders nothing by default. A certified CMP
 * for EEA/UK/Switzerland must be connected before serving personalised ads
 * there — see README.
 */
export function AdSenseScript() {
  if (!siteConfig.adsenseEnabled || !siteConfig.adsenseClient) return null;
  return (
    <Script
      id="adsbygoogle-init"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClient}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
