import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/**
 * Dynamic 1200×630 branded Open Graph / Discover image (§8).
 *
 * Generates a clean title card per page (not the bare logo, not a stock photo)
 * so every important page can expose a strong 16:9-ish social image via
 * `og:image` and Article structured data. Cached at the edge/CDN.
 */
const size = { width: 1200, height: 630 };

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? siteConfig.tagline).slice(0, 140);
  const eyebrow = (searchParams.get("eyebrow") ?? siteConfig.siteName).slice(0, 60);

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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#ffffff",
              color: "#0F6B5B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            $
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, opacity: 0.95 }}>{eyebrow}</div>
        </div>

        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>
          {title}
        </div>

        <div style={{ fontSize: 26, opacity: 0.9 }}>
          {`${siteConfig.siteName} · Independent Australian home-cost calculators & guides`}
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    },
  );
}
