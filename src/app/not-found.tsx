import Link from "next/link";
import { Container } from "@/components/ui/primitives";

/** Useful 404 with links to key hubs and search; no ads (spec §64/§18.1). */
export default function NotFound() {
  return (
    <div className="py-20">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">404</p>
          <h1 className="mt-2 text-3xl font-bold">We couldn&apos;t find that cost guide.</h1>
          <p className="mt-3 text-muted">
            The page may have moved. Try a calculator, a cost guide, or search the site.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/calculators" className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white no-underline">
              Calculators
            </Link>
            <Link href="/renovations" className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold no-underline">
              Renovation costs
            </Link>
            <Link href="/solar-batteries" className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold no-underline">
              Energy & solar
            </Link>
            <Link href="/search" className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold no-underline">
              Search
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
