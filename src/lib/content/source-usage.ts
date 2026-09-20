import { getSource } from "@/data/sources/registry";
import { getCostDatum } from "@/data/costs/index";
import { content, type ContentEntry } from "@/lib/content/registry";

/**
 * Content entries reference sources either directly (a source id) or indirectly
 * (a cost-datum id, whose `sourceId` points at the source). This resolves a mixed
 * list to a deduped list of real source ids.
 */
export function resolveToSourceIds(ids: string[]): string[] {
  const out: string[] = [];
  for (const id of ids) {
    if (getSource(id)) {
      if (!out.includes(id)) out.push(id);
      continue;
    }
    const datum = getCostDatum(id);
    if (datum && getSource(datum.sourceId) && !out.includes(datum.sourceId)) {
      out.push(datum.sourceId);
    }
  }
  return out;
}

export interface SourceUsage {
  sourceId: string;
  pages: { slug: string; title: string }[];
}

/** Map each source to the indexable pages that cite it (for the Sources page). */
export function sourceUsage(): Map<string, ContentEntry[]> {
  const map = new Map<string, ContentEntry[]>();
  for (const entry of content) {
    for (const sourceId of resolveToSourceIds(entry.sourceIds)) {
      const list = map.get(sourceId) ?? [];
      list.push(entry);
      map.set(sourceId, list);
    }
  }
  return map;
}
