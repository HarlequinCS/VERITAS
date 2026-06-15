import Link from "next/link";
import { Clock, UserRound } from "lucide-react";

const TICKETS = [
  { id: "VR-TK-104", finding: "CWE-285 Broken Access Control", owner: "Ari Developer", status: "Open", sla: "42h left" },
  { id: "VR-TK-103", finding: "Auth token leaked in redirect", owner: "Nora Engineer", status: "Pending Verification", sla: "18h left" },
  { id: "VR-TK-099", finding: "Missing security headers", owner: "Solo Queue", status: "Closed", sla: "Met" },
];

export default function TicketsPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">Remediation Queue</p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">Tickets and verification</h1>
      <div className="glass mt-8 overflow-hidden rounded-2xl">
        {TICKETS.map((ticket) => (
          <Link key={ticket.id} href="/vulnerabilities/cwe-285" className="flex flex-wrap items-center gap-4 border-b border-veritas-border-subtle/60 px-5 py-4 last:border-0 hover:bg-veritas-surface/40">
            <span className="font-mono text-xs text-veritas-electric">{ticket.id}</span>
            <span className="min-w-[240px] flex-1 text-sm text-white">{ticket.finding}</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><UserRound className="h-3.5 w-3.5" />{ticket.owner}</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><Clock className="h-3.5 w-3.5" />{ticket.sla}</span>
            <span className="rounded-full border border-veritas-border-subtle px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300">{ticket.status}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
