"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ChevronsLeft,
  ChevronsRight,
  Crosshair,
  FileText,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Target,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const ICON_SRC = "https://saifuliqbal.dev/veritasicon.png";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Workspace",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/targets/new", label: "Targets", icon: Target },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/scans/live", label: "Live Scans", icon: Activity, badge: "2" },
      {
        href: "/vulnerabilities/cwe-285",
        label: "Vulnerabilities",
        icon: ShieldAlert,
        badge: "14",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/reports", label: "Reports", icon: FileText },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href.split("/").slice(0, 2).join("/"));
}

export function PrimarySidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <aside
      className={`hidden shrink-0 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-r lg:border-veritas-border-subtle/70 lg:bg-veritas-bg/70 lg:backdrop-blur-xl lg:transition-[width] lg:duration-200 ${
        collapsed ? "lg:w-[72px]" : "lg:w-[248px]"
      }`}
      aria-label="Primary"
    >
      <div className="flex h-16 items-center justify-between border-b border-veritas-border-subtle/70 px-3">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-veritas-surface ring-1 ring-veritas-border-strong">
            <Image
              src={ICON_SRC}
              alt="VERITAS"
              width={22}
              height={22}
              className="object-contain"
            />
            <span className="absolute -inset-0.5 rounded-lg bg-cyan-500/20 opacity-0 blur transition group-hover:opacity-100" />
          </span>
          {!collapsed && (
            <span className="font-semibold tracking-[0.18em] text-white">
              VERITAS
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-veritas-surface hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title="Toggle sidebar (⌘B)"
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-5">
            {!collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {section.title}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-veritas-surface-alt text-white"
                          : "text-slate-400 hover:bg-veritas-surface/70 hover:text-white"
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      {active && (
                        <span
                          aria-hidden
                          className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                        />
                      )}
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          active ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-200"
                        }`}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-full border border-veritas-border-strong bg-veritas-bg px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-veritas-border-subtle/70 p-3">
        {collapsed ? (
          <div className="flex justify-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-veritas-surface ring-1 ring-veritas-border-strong">
              <Zap className="h-3.5 w-3.5 text-cyan-300" />
            </span>
          </div>
        ) : (
          <Link
            href="/scans/live"
            className="flex items-center gap-2.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/60 p-2.5 transition hover:border-cyan-400/30 hover:bg-veritas-surface-alt"
          >
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-veritas-bg ring-1 ring-veritas-border-strong">
              <Crosshair className="h-3.5 w-3.5 text-cyan-300" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-cyan-400/60" />
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">
                2 scans active
              </p>
              <p className="truncate text-[11px] text-slate-500">
                Live Operations Center
              </p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
