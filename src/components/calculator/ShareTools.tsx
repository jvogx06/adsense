"use client";

import { useState } from "react";

/**
 * Copy-link + print controls (spec §11/§56). Deliberately plain and never
 * placed adjacent to an ad. Print uses window.print(); a print stylesheet hides
 * ads and navigation (see globals / print rules).
 */
export function ShareTools() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:border-primary"
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:border-primary"
      >
        Print
      </button>
    </div>
  );
}
