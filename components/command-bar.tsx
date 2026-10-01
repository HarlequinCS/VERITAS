"use client";

import {
  Bell,
  ChevronRight,
  Command,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { signOutUser } from "@/app/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ICON_SRC = "https://saifuliqbal.dev/veritasicon.png";

function deriveCrumbs(pathname: string | null) {
  if (!pathname || pathname === "/") return ["Workspace"];
  const segs = pathname.split("/").filter(Boolean);
  const titled = segs.map((s) =>
    s
      .replace(/[-_]/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .replace(/\b(Cwe)\b/i, "CWE"),
  );
  return ["Workspace", ...titled];
}

export function CommandBar({
  username = "User",
  role = "Workspace",
}: {
  username?: string;
  role?: string;
}) {
  const pathname = usePathname();
  const crumbs = deriveCrumbs(pathname);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-veritas-border-subtle/70 bg-veritas-bg/85 px-4 backdrop-blur-xl sm:px-6">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-veritas-border-subtle text-slate-300 lg:hidden"
          onClick={() => setMobileNavOpen((s) => !s)}
          aria-label="Toggle navigation"
        >
          {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <nav
          aria-label="Breadcrumb"
          className="hidden min-w-0 items-center gap-1.5 text-sm font-medium text-slate-400 md:flex"
        >
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-700" />}
              <span
                className={
                  i === crumbs.length - 1 ? "text-slate-200" : "text-slate-300"
                }
              >
                {c}
              </span>
            </span>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Search"
          className="ml-auto flex h-11 max-w-[420px] flex-1 items-center gap-2.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-left text-base text-slate-300 transition hover:border-veritas-border-strong hover:text-white sm:flex-1"
        >
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <span className="hidden flex-1 truncate sm:block">
            Search targets, findings, sessions...
          </span>
          <span className="ml-auto hidden items-center gap-1 rounded border border-veritas-border-subtle bg-veritas-bg px-1.5 py-0.5 font-mono text-xs text-slate-300 sm:flex">
            <Command className="h-3 w-3" />K
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 md:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Operational
          </span>

          <Link
            href="/notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-veritas-border-subtle text-slate-300 transition hover:border-veritas-electric/40 hover:bg-veritas-surface hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
              3
            </span>
          </Link>

          <Link
            href="/account"
            className="hidden h-11 items-center gap-2 rounded-lg border border-veritas-border-subtle px-2 transition hover:border-veritas-electric/40 hover:bg-veritas-surface sm:flex"
            aria-label="User menu"
          >
            <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-veritas-surface ring-1 ring-veritas-border-strong">
              <Image
                src={ICON_SRC}
                alt=""
                width={28}
                height={28}
                className="object-contain p-1"
              />
            </span>
            <span className="hidden text-left md:block">
              <span className="block text-xs font-semibold leading-tight text-white">
                {username}
              </span>
              <span className="block text-xs leading-tight text-slate-300">
                {role}
              </span>
            </span>
          </Link>

          <form action={signOutUser} className="hidden sm:block">
            <button
              type="submit"
              className="flex h-11 items-center gap-1.5 rounded-lg border border-veritas-border-subtle px-2.5 text-sm text-slate-300 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200"
              title="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Log out</span>
            </button>
          </form>
        </div>
      </header>

      {paletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-veritas-bg/70 px-4 pt-[12vh] backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="glass-strong w-full max-w-xl overflow-hidden rounded-2xl shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-veritas-border-subtle px-4 py-3">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                autoFocus
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <kbd className="rounded border border-veritas-border-subtle bg-veritas-bg px-1.5 py-0.5 font-mono text-xs text-slate-300">
                ESC
              </kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2 scrollbar-thin">
              <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                Quick actions
              </p>
              {[
                { href: "/dashboard", label: "Open Command Center" },
                { href: "/targets/new", label: "New target configuration" },
                { href: "/scans/live", label: "View live scan tracker" },
                { href: "/vulnerabilities/cwe-285", label: "Open last finding" },
                { href: "/reports", label: "Generate report" },
              ].map((cmd) => (
                <Link
                  key={cmd.href}
                  href={cmd.href}
                  onClick={() => setPaletteOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-veritas-surface hover:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-veritas-electric" />
                    {cmd.label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
