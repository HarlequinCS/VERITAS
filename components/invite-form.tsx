"use client";

import { useActionState } from "react";
import { inviteMember } from "@/app/actions/members";

export function InviteForm() {
  const [state, action, pending] = useActionState(inviteMember, null);

  return (
    <form action={action} className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_160px_auto]">
        <input
          name="email"
          type="email"
          required
          placeholder="name@company.com"
          className="h-11 rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 px-3.5 text-sm text-white outline-none"
        />
        <select name="role" defaultValue="analyst" className="h-11 rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 px-3 text-sm text-white">
          <option value="admin">admin</option>
          <option value="analyst">analyst</option>
          <option value="developer">developer</option>
          <option value="viewer">viewer</option>
        </select>
        <button type="submit" disabled={pending} className="h-11 rounded-xl bg-electric-mix px-4 text-sm font-semibold text-veritas-bg disabled:opacity-50">
          {pending ? "Inviting…" : "Invite"}
        </button>
      </div>
      {state?.error && <p className="text-xs text-rose-300">{state.error}</p>}
      {state?.success && (
        <p className="break-all text-xs text-emerald-300">
          Invite created. Share this link if email is not configured: {state.link}
        </p>
      )}
    </form>
  );
}
