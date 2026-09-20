"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/config/navigation";
import { Logo } from "./Logo";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Responsive header (spec §6.1/§6.2/§11). Server-rendered links; a small client
 * island manages the mobile drawer with focus trap, ESC-to-close and body
 * scroll lock. Fixed height reserves space so there is no layout shift.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Body scroll lock + ESC + focus trap while open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const drawer = drawerRef.current;
    const focusables = drawer?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
    );
    focusables?.[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        openButtonRef.current?.focus();
        return;
      }
      if (e.key === "Tab" && focusables && focusables.length > 0) {
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-md px-3 py-2 text-sm font-medium no-underline hover:bg-background ${
                      active ? "text-primary-dark underline" : "text-text"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="grid h-11 w-11 place-items-center rounded-md text-text hover:bg-background"
            aria-label="Search the site"
          >
            <SearchIcon />
          </Link>
          <button
            ref={openButtonRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-md text-text hover:bg-background lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-16 z-30 bg-text/20"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div
            ref={drawerRef}
            id="mobile-drawer"
            className="relative z-40 border-t border-border bg-surface"
          >
            <nav aria-label="Mobile" className="mx-auto max-w-[1280px] px-4 py-3 sm:px-6">
              <ul className="flex flex-col">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-3 text-base font-medium text-text no-underline hover:bg-background"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-2 border-t border-border pt-2">
                  <Link
                    href="/methodology"
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 no-underline"
                  >
                    Methodology
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 no-underline"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sources"
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 no-underline"
                  >
                    Data Sources
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
