"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { acceptInvite } from "@/app/actions/members";

export function AcceptInviteForm({
  token,
  action,
  label = "Accept invite",
}: {
  token: string;
  action: typeof acceptInvite;
  label?: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, null);
  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);

  return (
    <form action={formAction} className="mt-6 space-y-3">
      <input type="hidden" name="token" value={token} />
      <button type="submit" disabled={pending} className="h-11 w-full rounded-xl bg-electric-mix text-sm font-semibold text-veritas-bg disabled:opacity-50">
        {pending ? "Working…" : label}
      </button>
      {state?.error && <p className="text-xs text-rose-300">{state.error}</p>}
      {state?.success && <p className="text-xs text-emerald-300">You joined the workspace. Open the dashboard.</p>}
    </form>
  );
}
