import Image from "next/image";
import Link from "next/link";

const LOGO_SRC = "https://saifuliqbal.dev/veritaslogo.png";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Reading a finding", href: "/blog/how-to-read-a-finding" },
      { label: "Status", href: "/status" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-veritas-border-subtle/60 bg-veritas-surface/40 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div className="lg:col-span-2">
            <Image
              src={LOGO_SRC}
              alt="VERITAS"
              width={240}
              height={48}
              className="h-10 w-auto object-contain object-left"
            />
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-500">
              Register an application you own, keep the evidence, and turn the finding into a fix a developer can apply or a lead can assign.
            </p>
            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {["X", "in", "GH"].map((s) => (
                <span
                  key={s}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-veritas-border-subtle text-[10px] font-label font-bold text-slate-600 transition hover:border-veritas-electric/40 hover:text-slate-400 cursor-default"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="font-label text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-veritas-border-subtle/40 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© 2025 VERITAS Inc. All rights reserved.</p>
          <p className="text-slate-300">This site does not claim a compliance certification.</p>
        </div>
      </div>
    </footer>
  );
}
