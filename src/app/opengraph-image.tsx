import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.siteName} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded default Open Graph image generated from config (spec §28). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F6B5B",
          color: "#ffffff",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, opacity: 0.9 }}>
          {siteConfig.siteName}
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.1, maxWidth: 960 }}>
          {siteConfig.tagline}
        </div>
        <div style={{ fontSize: 28, opacity: 0.9 }}>
          Independent calculators & cost guides · Australian data · Sources shown
        </div>
      </div>
    ),
    { ...size },
  );
}
