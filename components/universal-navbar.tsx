"use client";

import { BrandLogo } from "@/components/brand-logo";
import { useMockAuth } from "@/components/mock-auth-provider";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#documentation", label: "Documentation" },
  { href: "/#enterprise", label: "Enterprise" },
] as const;

const ICON_SRC = "https://saifuliqbal.dev/veritasicon.png";

export function UniversalNavbar() {
  const pathname = usePathname();
  const { isSignedIn, signOut } = useMockAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    }
    if (accountOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [accountOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-veritas-border-subtle/70 bg-veritas-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4.75rem] max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:min-h-24 sm:gap-6 sm:px-6 lg:min-h-[7rem] lg:px-8">
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <BrandLogo variant="nav" href="/" />
        </div>

        <nav
          className="hidden items-center justify-center gap-1 md:flex lg:gap-2"
          aria-label="Main"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-veritas-surface hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 text-neutral-300 transition hover:bg-neutral-900 hover:text-white md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
            <span className="sr-only">Toggle menu</span>
          </button>

          {isSignedIn ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-900 outline-none ring-offset-2 ring-offset-neutral-950 transition hover:border-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-500 sm:h-11 sm:w-11"
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <Image
                  src={ICON_SRC}
                  alt="Account"
                  width={44}
                  height={44}
                  className="object-contain p-1.5"
                  sizes="44px"
                />
              </button>
              {accountOpen ? (
                <div
                  id="account-menu"
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] rounded-xl border border-neutral-800 bg-neutral-950 py-1 shadow-xl shadow-black/40"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
                    onClick={() => {
                      signOut();
                      setAccountOpen(false);
                    }}
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link
                href="/auth"
                className="rounded-lg border border-veritas-border-strong px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-veritas-surface sm:px-3 sm:text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center rounded-lg bg-neon-mix px-3 py-2 text-sm font-semibold text-veritas-bg shadow-glow-cyan transition hover:opacity-95 sm:px-4"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-neutral-800 bg-neutral-950 px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
