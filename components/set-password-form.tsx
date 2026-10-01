"use client";

import { useActionState } from "react";
import { setAccountPassword } from "@/app/actions/auth";

const initialState = { error: "" as string, success: false as boolean };

export function SetPasswordForm() {
  const [state, action, pending] = useActionState(setAccountPassword, initialState);

  return (
    <form action={action} className="mt-4 space-y-3">
      <input
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        placeholder="New password"
        className="h-11 w-full max-w-md rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 px-3.5 text-base text-white outline-none"
      />
      <input
        name="confirmPassword"
        type="password"
        required
        minLength={8}
        autoComplete="new-password"
        placeholder="Confirm password"
        className="h-11 w-full max-w-md rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 px-3.5 text-base text-white outline-none"
      />
      {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-300">Password saved. You can sign in with email and this password.</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center rounded-lg bg-electric-mix px-4 text-base font-semibold text-veritas-bg disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}
