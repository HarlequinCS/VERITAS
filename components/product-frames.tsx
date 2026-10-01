export function FindingFrame() {
  return (
    <div className="overflow-hidden rounded-2xl border border-veritas-border-subtle bg-veritas-surface/70">
      <div className="border-b border-veritas-border-subtle px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-400">
        Finding
      </div>
      <div className="space-y-3 p-4">
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="rounded-md border border-rose-400/30 bg-rose-400/10 px-2 py-0.5 text-rose-200">Critical</span>
          <span className="rounded-md border border-veritas-border-subtle px-2 py-0.5 font-mono text-veritas-electric">CWE-285</span>
          <span className="rounded-md border border-veritas-border-subtle px-2 py-0.5 font-mono text-veritas-arc">OWASP A01</span>
        </div>
        <p className="text-sm font-semibold text-white">Broken access control on /admin/users</p>
        <p className="text-sm leading-relaxed text-slate-400">
          An authenticated user reached an administrative route without an admin role. The record keeps the path, the evidence, and a suggested fix.
        </p>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-300">
          {["Analysis", "Evidence", "Fix"].map((tab) => (
            <div key={tab} className="rounded-lg border border-veritas-border-subtle py-2">
              {tab}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TicketFrame() {
  return (
    <div className="overflow-hidden rounded-2xl border border-veritas-border-subtle bg-veritas-surface/70">
      <div className="border-b border-veritas-border-subtle px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-400">
        Remediation queue
      </div>
      <ul className="divide-y divide-veritas-border-subtle/70 text-sm">
        {[
          ["Open", "CWE-285 · /admin/users"],
          ["In Progress", "Assigned to a developer"],
          ["Resolved", "Waiting on verification"],
        ].map(([status, detail]) => (
          <li key={status} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-slate-300">{detail}</span>
            <span className="shrink-0 text-slate-400">{status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WorkspaceFrame() {
  return (
    <div className="overflow-hidden rounded-2xl border border-veritas-border-subtle bg-veritas-surface/70">
      <div className="border-b border-veritas-border-subtle px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-400">
        Organization
      </div>
      <ul className="divide-y divide-veritas-border-subtle/70 text-sm">
        {[
          ["Owner", "Creates the organization and manages members"],
          ["Admin", "Invites people and changes non-owner roles"],
          ["Analyst", "Reviews findings"],
          ["Developer", "Works the assigned fix"],
          ["Viewer", "Reads the workspace"],
        ].map(([role, detail]) => (
          <li key={role} className="flex items-start justify-between gap-3 px-4 py-3">
            <span className="text-white">{role}</span>
            <span className="text-right text-slate-400">{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TargetFrame() {
  return (
    <div className="overflow-hidden rounded-2xl border border-veritas-border-subtle bg-veritas-surface/70">
      <div className="border-b border-veritas-border-subtle px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-400">
        New target
      </div>
      <div className="space-y-3 p-4 text-sm">
        {[
          ["Application URL", "https://app.example.com"],
          ["Environment", "Staging"],
          ["Auth", "Optional token or cookie"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 rounded-lg border border-veritas-border-subtle px-3 py-2 text-slate-200">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
