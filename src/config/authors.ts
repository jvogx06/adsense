import { siteConfig } from "@/config/site";

/**
 * Author / reviewer model (P1 §17).
 *
 * The architecture supports a named author and a qualified reviewer, but we do
 * NOT invent people or credentials. By default the only author is the editorial
 * organisation entity — no fake individual, no claimed qualifications, and no
 * implication that the operator is physically Australian. A real named editor or
 * reviewer is added only if the owner chooses to publish that identity.
 */
export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  profileUrl?: string;
  /** True for an organisation entity rather than a named individual. */
  isOrganisation: boolean;
}

export interface Reviewer {
  id: string;
  name: string;
  qualification: string;
  reviewedAt: string;
  profileUrl?: string;
}

const authors: Record<string, Author> = {
  "editorial-team": {
    id: "editorial-team",
    name: `${siteConfig.siteName} Editorial Team`,
    role: "Editorial",
    bio: `${siteConfig.siteName} is an independent information site focused on Australian home costs. We build calculators and cost guides from dated, cited sources, and keep advertising separate from editorial conclusions.`,
    isOrganisation: true,
  },
};

/** Real reviewers only. Empty until a named, qualified reviewer is engaged. */
const reviewers: Record<string, Reviewer> = {};

export function getAuthor(id: string | null | undefined): Author {
  return (id && authors[id]) || authors["editorial-team"]!;
}

export function getReviewer(id: string | null | undefined): Reviewer | null {
  if (!id) return null;
  return reviewers[id] ?? null;
}
