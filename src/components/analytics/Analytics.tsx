"use client";

import Script from "next/script";
import { useCallback, useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";

const CONSENT_KEY = "hca-consent-v1";
type Consent = "unknown" | "granted" | "denied";

const listeners = new Set<() => void>();

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : "unknown";
  } catch {
    return "unknown";
  }
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  if (typeof window !== "undefined") window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", cb);
  };
}

function writeConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

/**
 * Consent-gated GA4 (spec §20). Renders nothing at all when no measurement id
 * is configured — analytics degrade cleanly to "off". When configured, GA only
 * loads after the visitor grants consent, and a small, honest banner records
 * the choice via an external store (hydration-safe, no state-in-effect).
 *
 * This is NOT a certified IAB TCF CMP: serving personalised ads to
 * EEA/UK/Switzerland visitors requires a certified CMP (e.g. Google Privacy &
 * Messaging), connected before enabling AdSense there. See Cookie Policy/README.
 */
export function Analytics() {
  const gaId = siteConfig.gaMeasurementId;
  const consent = useSyncExternalStore<Consent>(
    subscribe,
    readConsent,
    () => "unknown",
  );

  const choose = useCallback((value: Consent) => writeConsent(value), []);

  if (!gaId) return null;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'granted'
              });
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {consent === "unknown" && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Analytics consent"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface p-4 shadow-card"
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text">
              We use privacy-friendly analytics to understand which tools and
              guides are useful. No analytics run until you choose. See our{" "}
              <a href="/cookie-policy" className="underline">
                Cookie Policy
              </a>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
              >
                Allow analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
