"use client";

import { useActionState, useState } from "react";
import { enrollTotp, verifyTotp } from "@/app/actions/security";

export function MfaEnrollment({ enrolled }: { enrolled: boolean }) {
  const [start, setStart] = useState<{ factorId: string; qr: string; secret: string } | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyTotp, null);

  async function begin() {
    setPending(true);
    setStartError(null);
    const result = await enrollTotp();
    setPending(false);
    if (result.error || !result.factorId || !result.qr || !result.secret) {
      setStartError(result.error ?? "Could not start enrollment.");
      return;
    }
    setStart({ factorId: result.factorId, qr: result.qr, secret: result.secret });
  }

  if (enrolled && !start) {
    return <p className="mt-3 text-sm text-slate-400">An authenticator app is already enrolled.</p>;
  }

  return (
    <div className="mt-4 space-y-4">
      {!start && (
        <button
          type="button"
          onClick={begin}
          disabled={pending}
          className="inline-flex h-10 items-center rounded-lg border border-veritas-border-subtle px-4 text-sm text-slate-200 hover:border-veritas-electric/40"
        >
          {pending ? "Starting…" : "Set up authenticator app"}
        </button>
      )}
      {startError && <p className="text-xs text-rose-300">{startError}</p>}
      {start && (
        <form action={verifyAction} className="space-y-3">
          <div
            role="img"
            aria-label="Authenticator QR code"
            className="h-40 w-40 rounded-lg bg-white bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${start.qr}")` }}
          />
          <p className="break-all text-xs text-slate-500">Secret: {start.secret}</p>
          <input type="hidden" name="factor_id" value={start.factorId} />
          <input
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            className="h-11 w-full max-w-xs rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 px-3.5 text-sm text-white outline-none"
          />
          <button type="submit" disabled={verifyPending} className="inline-flex h-10 items-center rounded-lg bg-electric-mix px-4 text-sm font-semibold text-veritas-bg">
            {verifyPending ? "Verifying…" : "Verify code"}
          </button>
          {verifyState?.error && <p className="text-xs text-rose-300">{verifyState.error}</p>}
          {verifyState?.success && <p className="text-xs text-emerald-300">Authenticator enrolled.</p>}
        </form>
      )}
    </div>
  );
}
