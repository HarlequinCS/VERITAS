"use client";

import { BrandLogo } from "@/components/brand-logo";
import { useMockAuth } from "@/components/mock-auth-provider";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/#features", label: "Platform" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
] as const;

const ICON_SRC = "https://saifuliqbal.dev/veritasicon.png";

export function UniversalNavbar() {
  const pathname = usePathname();
  const { isSignedIn, signOut } = useMockAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-nav border-b border-veritas-border-subtle/70 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
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
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-veritas-border-subtle text-slate-400 transition hover:bg-veritas-surface hover:text-white md:hidden"
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
                className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-veritas-border-subtle bg-veritas-surface outline-none ring-offset-2 ring-offset-veritas-bg transition hover:border-veritas-border-strong focus-visible:ring-2 focus-visible:ring-veritas-electric"
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
                  className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] rounded-xl border border-veritas-border-subtle bg-veritas-surface py-1 shadow-xl shadow-black/40"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-400 transition hover:bg-veritas-elevated hover:text-white"
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
                className="hidden rounded-lg border border-veritas-border-subtle px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-veritas-electric/40 hover:bg-veritas-surface sm:inline-flex sm:text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-electric-mix px-3 py-2 text-xs font-semibold text-white shadow-glow-electric transition hover:opacity-95 sm:px-4 sm:text-sm"
              >
                Request Demo
              </Link>
            </>
          )}
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-veritas-border-subtle/70 bg-veritas-bg px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-veritas-surface hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-lg bg-electric-mix px-3 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Request Demo
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
