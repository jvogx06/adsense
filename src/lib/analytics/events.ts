/**
 * First-party analytics events (spec §20.2).
 *
 * These are the ONLY events the site emits. They never include personal data or
 * calculator dollar amounts, and there is deliberately no `ad_clicked` event —
 * the site never instruments or correlates ad clicks (spec §18.1/§20.2).
 * Every call is a no-op unless GA is loaded and consented.
 */

type GtagFn = (...args: unknown[]) => void;

function gtag(): GtagFn | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { gtag?: GtagFn };
  return typeof w.gtag === "function" ? w.gtag : null;
}

function track(event: string, params: Record<string, string | number>) {
  gtag()?.("event", event, params);
}

export const analytics = {
  calculatorStarted(calculatorId: string) {
    track("calculator_started", { calculator_id: calculatorId });
  },
  calculatorCompleted(calculatorId: string, scenarioType = "default") {
    track("calculator_completed", {
      calculator_id: calculatorId,
      scenario_type: scenarioType,
    });
  },
  calculatorReset(calculatorId: string) {
    track("calculator_reset", { calculator_id: calculatorId });
  },
  sourceLinkClicked(sourceId: string, pageSlug: string) {
    track("source_link_clicked", { source_id: sourceId, page_slug: pageSlug });
  },
  relatedContentClicked(fromSlug: string, toSlug: string) {
    track("related_content_clicked", { from_slug: fromSlug, to_slug: toSlug });
  },
  relatedGuideClicked(fromSlug: string, toSlug: string) {
    track("related_guide_click", { from_slug: fromSlug, to_slug: toSlug });
  },
  copyResult(pageSlug: string) {
    track("copy_result", { page_slug: pageSlug });
  },
  internalSearch(queryLength: number, resultCount: number) {
    track("internal_search", {
      query_length: queryLength,
      result_count: resultCount,
    });
  },
  outboundLinkClicked(destinationDomain: string, pageSlug: string) {
    track("outbound_link_clicked", {
      destination_domain: destinationDomain,
      page_slug: pageSlug,
    });
  },
};
