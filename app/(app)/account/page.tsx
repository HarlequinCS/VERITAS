import Link from "next/link";
import { KeyRound, UserRound } from "lucide-react";

export default function AccountPage() {
  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">Account</p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">Workspace profile</h1>
      <section className="glass mt-8 rounded-2xl p-5">
        <UserRound className="h-7 w-7 text-veritas-electric" />
        <h2 className="mt-4 text-lg font-semibold text-white">Maya Khoury</h2>
        <p className="mt-1 text-sm text-slate-400">Lead · Acme Workspace</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Workspace roles are assigned by the workspace owner. The public scanner
          account is intentionally separate from the private founder operations console.
        </p>
        <Link href="/settings" className="mt-5 inline-flex items-center gap-2 rounded-lg border border-veritas-border-subtle px-4 py-2 text-sm text-slate-300 hover:border-veritas-electric/40 hover:text-white">
          <KeyRound className="h-4 w-4" /> Manage workspace settings
        </Link>
      </section>
    </main>
  );
}
