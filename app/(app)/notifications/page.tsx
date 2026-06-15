import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, Sparkles } from "lucide-react";

const ITEMS = [
  { icon: AlertTriangle, title: "Critical finding verified", body: "CWE-285 reproduced on /admin/users. Assign or mark for immediate fix.", href: "/vulnerabilities/cwe-285" },
  { icon: Sparkles, title: "Patch draft ready", body: "AI validator approved remediation schema for sess-2098.", href: "/vulnerabilities/cwe-285" },
  { icon: Clock, title: "SLA warning", body: "Ticket VR-TK-104 reaches escalation window in 6 hours.", href: "/tickets" },
  { icon: CheckCircle2, title: "Scan completed", body: "billing.acme.io completed with 7 findings and 2 visual PoCs.", href: "/reports" },
];

export default function NotificationsPage() {
  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">Notifications</p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">Workspace activity</h1>
      <div className="mt-8 space-y-3">
        {ITEMS.map((item) => (
          <Link key={item.title} href={item.href} className="glass flex gap-4 rounded-2xl p-4 transition hover:border-veritas-electric/30">
            <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-veritas-electric" />
            <div>
              <h2 className="text-sm font-semibold text-white">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{item.body}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
