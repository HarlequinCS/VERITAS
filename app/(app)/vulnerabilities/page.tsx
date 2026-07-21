import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldAlert, ChevronRight } from "lucide-react";

const SEV_COLOR: Record<string, string> = {
  Critical: "text-rose-300 border-rose-400/30 bg-rose-400/10",
  High: "text-amber-300 border-amber-400/30 bg-amber-400/10",
  Medium: "text-yellow-300 border-yellow-400/30 bg-yellow-400/10",
  Low: "text-slate-300 border-slate-500/30 bg-slate-500/10",
  Info: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10",
};

export default async function VulnerabilitiesPage() {
  const supabase = await createClient();
  let vulns: any[] = [];
  let error: string | null = null;

  try {
    const { data, error: dbErr } = await supabase
      .from("detected_vulnerabilities")
      .select(
        "vuln_id, cwe_id, owasp_category, severity_level, endpoint_url, is_false_positive, scan_sessions!inner(target_applications(target_url))"
      )
      .eq("is_false_positive", false)
      .order("created_at", { ascending: false })
      .limit(25);

    if (dbErr) {
      error = dbErr.message;
    } else {
      vulns = data ?? [];
    }
  } catch {
    error = "Unable to load vulnerabilities.";
  }

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">
          Findings
        </p>
        <h1 className="mt-1.5 text-3xl font-semibold text-white">
          Vulnerabilities
        </h1>
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

      {!error && vulns.length === 0 && (
        <div className="mt-8">
          <EmptyState
            icon={ShieldAlert}
            title="No vulnerabilities found"
            description="Run a scan against a target to detect and classify security issues."
            action={{ label: "Start a scan", href: "/targets/new" }}
          />
        </div>
      )}

      {!error && vulns.length > 0 && (
        <div className="glass mt-8 overflow-hidden rounded-2xl">
          {vulns.map((v) => {
            const ta = v.scan_sessions?.target_applications;
            const targetUrl =
              (Array.isArray(ta) ? ta[0]?.target_url : ta?.target_url) ??
              "Unknown";
            return (
              <Link
                key={v.vuln_id}
                href={`/vulnerabilities/${v.cwe_id ?? "cwe-285"}`}
                className="flex flex-wrap items-center gap-4 border-b border-veritas-border-subtle/60 px-5 py-4 transition last:border-0 hover:bg-veritas-surface/40"
              >
                <span
                  className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                    SEV_COLOR[v.severity_level] ?? SEV_COLOR["Info"]
                  }`}
                >
                  {v.severity_level}
                </span>
                <span className="min-w-[200px] flex-1 text-sm text-white">
                  {v.owasp_category ?? "Unknown"} ·{" "}
                  {v.cwe_id ?? "CWE-???"}
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {targetUrl}
                </span>
                <span className="font-mono text-xs text-veritas-electric">
                  {v.endpoint_url ?? "—"}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
