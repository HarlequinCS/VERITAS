import Link from "next/link";
import { Clock, FileText, UserRound } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { EmptyState } from "@/components/ui/empty-state";

type TicketRow = {
  ticket_id: string;
  ticket_status: string;
  sla_due_date: string | null;
  created_at: string;
  detected_vulnerabilities:
    | {
        cwe_id: string | null;
        owasp_category: string | null;
        endpoint_url: string | null;
      }
    | Array<{
        cwe_id: string | null;
        owasp_category: string | null;
        endpoint_url: string | null;
      }>
    | null;
};

function fmtSLA(due: string | null): string {
  if (!due) return "No SLA";
  const diff = new Date(due).getTime() - Date.now();
  if (diff <= 0) return "Overdue";
  const h = Math.floor(diff / 3600000);
  if (h > 48) return `${Math.floor(h / 24)}d left`;
  return `${h}h left`;
}

function statusStyle(status: string) {
  switch (status) {
    case "Open":
      return "border-amber-400/30 bg-amber-400/10 text-amber-300";
    case "In Progress":
      return "border-veritas-electric/30 bg-veritas-electric/10 text-veritas-electric";
    case "Resolved":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    case "Closed":
      return "border-slate-500/30 bg-slate-500/10 text-slate-400";
    default:
      return "border-veritas-border-subtle bg-veritas-surface/40 text-slate-400";
  }
}

export default async function TicketsPage() {
  const supabase = await createClient();
  let tickets: TicketRow[] = [];
  let error: string | null = null;

  try {
    const { data, error: dbErr } = await supabase
      .from("remediation_tickets")
      .select(
        "ticket_id, ticket_status, sla_due_date, created_at, detected_vulnerabilities(cwe_id, owasp_category, endpoint_url)"
      )
      .order("created_at", { ascending: false })
      .limit(25);

    if (dbErr) {
      error = dbErr.message;
    } else {
      tickets = data ?? [];
    }
  } catch {
    error = "Unable to load tickets.";
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">
          Remediation Queue
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold text-white">Tickets and verification</h1>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
        >
          <span className="mt-0.5 shrink-0 text-rose-400">⚠</span>
          {error}
        </div>
      )}

      {!error && tickets.length === 0 && (
        <div className="mt-8">
          <EmptyState
            icon={FileText}
            title="No tickets yet"
            description="Vulnerabilities that are confirmed and assigned will appear here as remediation tickets."
            action={{ label: "Go to vulnerabilities", href: "/vulnerabilities" }}
          />
        </div>
      )}

      {!error && tickets.length > 0 && (
        <div className="glass mt-8 overflow-hidden rounded-2xl">
          {tickets.map((t) => {
            const vuln = Array.isArray(t.detected_vulnerabilities)
              ? t.detected_vulnerabilities[0]
              : t.detected_vulnerabilities;
            const finding = vuln
              ? `${vuln.cwe_id ?? "CWE-???"} · ${vuln.owasp_category ?? "Unknown"}`
              : "Unknown finding";
            const owner = "Unassigned";
            const ticketId = t.ticket_id.slice(0, 8).toUpperCase();
            return (
              <Link
                key={t.ticket_id}
                href={`/vulnerabilities/${vuln?.cwe_id ?? "cwe-285"}`}
                className="flex flex-wrap items-center gap-4 border-b border-veritas-border-subtle/60 px-5 py-4 transition last:border-0 hover:bg-veritas-surface/40"
              >
                <span className="font-mono text-xs text-veritas-electric">
                  VR-TK-{ticketId}
                </span>
                <span className="min-w-[240px] flex-1 text-sm text-white">
                  {finding}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <UserRound className="h-3.5 w-3.5" />
                  {owner}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  {fmtSLA(t.sla_due_date)}
                </span>
                <span
                  className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusStyle(
                    t.ticket_status
                  )}`}
                >
                  {t.ticket_status}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
