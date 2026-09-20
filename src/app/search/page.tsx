import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/primitives";
import { SearchClient } from "@/components/search/SearchClient";

/** Internal search is noindex,follow (spec §16/§27). */
export const metadata: Metadata = {
  title: "Search",
  description: "Search Home Cost Australia calculators and cost guides.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/search" },
};

export default function SearchPage() {
  return (
    <div className="py-10">
      <Container>
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">Search</h1>
          <p className="mt-2 text-muted">Find a calculator or cost guide.</p>
          <div className="mt-6">
            <Suspense fallback={<p className="text-muted">Loading search…</p>}>
              <SearchClient />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}
