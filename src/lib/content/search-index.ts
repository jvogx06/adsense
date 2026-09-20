import { indexableContent } from "@/lib/content/registry";

export interface SearchDoc {
  slug: string;
  title: string;
  description: string;
  category: string;
  keywords: string;
}

/** Lightweight search index built at module load from indexable content (spec §27). */
export const searchIndex: SearchDoc[] = indexableContent()
  .filter((e) => e.slug !== "/")
  .map((e) => ({
    slug: e.slug,
    title: e.title,
    description: e.description,
    category: e.category,
    keywords: [e.primaryKeyword, ...e.aliases, ...e.headings, e.category].join(" ").toLowerCase(),
  }));

export function searchContent(query: string, limit = 20): SearchDoc[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = searchIndex
    .map((doc) => {
      const haystack = `${doc.title} ${doc.description} ${doc.keywords}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (doc.title.toLowerCase().includes(term)) score += 3;
        if (doc.keywords.includes(term)) score += 2;
        if (haystack.includes(term)) score += 1;
      }
      return { doc, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((r) => r.doc);
}
