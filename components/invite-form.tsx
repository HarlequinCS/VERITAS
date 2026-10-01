"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { inviteMember, resendInvite } from "@/app/actions/members";

export function InviteForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(inviteMember, null);
  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);

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

export function ResendInviteButton({ inviteId, email }: { inviteId: string; email: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(resendInvite, null);
  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);
  return (
    <form action={action}>
      <input type="hidden" name="invite_id" value={inviteId} />
      <input type="hidden" name="email" value={email} />
      <button type="submit" disabled={pending} className="h-11 rounded-lg border border-veritas-border-subtle px-3 text-sm text-slate-200">
        {pending ? "Sending…" : "Resend"}
      </button>
      {state?.link && <p className="mt-2 max-w-xs break-all text-xs text-emerald-300">{state.link}</p>}
      {state?.error && <p className="mt-2 text-xs text-rose-300">{state.error}</p>}
    </form>
  );
}
