import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * Text/SVG wordmark built from config (spec §61) so a rebrand never requires
 * editing a raster asset. No permanent working name is baked into an image.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-bold text-primary-dark no-underline ${className}`}
      aria-label={`${siteConfig.siteName} — home`}
    >
      <span
        aria-hidden="true"
        className="grid h-8 w-8 place-items-center rounded-[10px] bg-primary text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" role="presentation">
          <path
            d="M3 11.5 12 4l9 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 10v9h14v-9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-lg leading-tight">{siteConfig.siteName}</span>
    </Link>
  );
}
