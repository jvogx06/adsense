"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";

export type AdPlacement =
  | "article-after-intro"
  | "article-mid-1"
  | "article-mid-2"
  | "article-end"
  | "hub-between-sections";

export interface AdSlotProps {
  placement: AdPlacement;
  /** AdSense ad-unit slot id (from your account), when enabled. */
  slot?: string;
  minHeight?: number;
  className?: string;
}

const DEFAULT_MIN_HEIGHT: Record<AdPlacement, number> = {
  "article-after-intro": 250,
  "article-mid-1": 250,
  "article-mid-2": 250,
  "article-end": 250,
  "hub-between-sections": 120,
};

/**
 * Ad slot abstraction (spec §18/§56).
 *
 * - Returns null when ads are disabled (the default) — the site is 100%
 *   functional without ads.
 * - Never renders a fake publisher id; only renders a live unit when
 *   `adsenseEnabled` (which already requires a real client id) AND a slot id
 *   are present.
 * - Reserves height before any script request to avoid CLS.
 * - In development, shows a discreet placeholder only when
 *   NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS=true. The placeholder never mimics real
 *   advertiser creative.
 * - Templates control ads, not content files. Swapping ad networks later means
 *   changing this component only.
 */
export function AdSlot({ placement, slot, minHeight, className = "" }: AdSlotProps) {
  const height = minHeight ?? DEFAULT_MIN_HEIGHT[placement];
  const insRef = useRef<HTMLModElement>(null);
  const live = siteConfig.adsenseEnabled && Boolean(siteConfig.adsenseClient) && Boolean(slot);

  useEffect(() => {
    if (!live) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* ad push failed — never a functional error */
    }
  }, [live]);

  if (live) {
    return (
      <div
        className={`my-6 ${className}`}
        style={{ minHeight: height }}
        aria-hidden="true"
        data-ad-placement={placement}
      >
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", minHeight: height }}
          data-ad-client={siteConfig.adsenseClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Development-only placeholder (never in production, never a live ad).
  if (process.env.NODE_ENV !== "production" && siteConfig.showAdPlaceholders) {
    return (
      <div
        className={`my-6 grid place-items-center rounded-md border border-dashed border-border bg-background text-xs text-muted ${className}`}
        style={{ minHeight: height }}
        data-ad-placement={placement}
      >
        Ad placeholder — not a live ad
      </div>
    );
  }

  return null;
}
