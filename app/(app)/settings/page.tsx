import { Bell, Database, KeyRound, ShieldCheck } from "lucide-react";

const SETTINGS = [
  { icon: KeyRound, title: "Auth Tokens", body: "Configure how short-lived JWTs and cookies are injected into ephemeral Playwright contexts." },
  { icon: ShieldCheck, title: "Scan Policy", body: "Set default intensity, production safeguards, and allowed target environments." },
  { icon: Bell, title: "Notifications", body: "Route critical findings, ticket status changes, and SLA warnings to your workspace." },
  { icon: Database, title: "Evidence Retention", body: "Control how long visual PoCs, traces, and AI analysis logs are kept." },
];

export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">
        Workspace Settings
      </p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">
        Scanner configuration
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
        Settings shown here are for customer workspaces. Founder/admin server
        monitoring lives in the private operations console, not inside the scanner.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {SETTINGS.map((item) => (
          <section key={item.title} className="glass rounded-2xl p-5">
            <item.icon className="h-6 w-6 text-veritas-electric" />
            <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
