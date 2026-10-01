"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/profile";

const inputClass =
  "h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 px-3.5 text-sm text-white outline-none transition focus:border-veritas-electric/50 focus:ring-1 focus:ring-veritas-electric/30";

export function ProfileEditor({
  email,
  displayName,
  jobTitle,
  phone,
  timezone,
  locale,
  roleLabel,
}: {
  email: string;
  displayName: string;
  jobTitle: string;
  phone: string;
  timezone: string;
  locale: string;
  roleLabel: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <Field label="Email" value={email} readOnly />
      <Field label="Role" value={roleLabel} readOnly />
      <label className="block text-xs font-medium text-slate-400">
        Display name
        <input name="username" required minLength={2} maxLength={40} defaultValue={displayName} className={`${inputClass} mt-1.5`} />
      </label>
      <label className="block text-xs font-medium text-slate-400">
        Job title
        <input name="job_title" maxLength={80} defaultValue={jobTitle} className={`${inputClass} mt-1.5`} />
      </label>
      <label className="block text-xs font-medium text-slate-400">
        Phone
        <input name="phone" maxLength={40} defaultValue={phone} className={`${inputClass} mt-1.5`} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-slate-400">
          Timezone
          <input name="timezone" maxLength={64} defaultValue={timezone} placeholder="Asia/Kuala_Lumpur" className={`${inputClass} mt-1.5`} />
        </label>
        <label className="block text-xs font-medium text-slate-400">
          Locale
          <input name="locale" maxLength={16} defaultValue={locale} placeholder="en" className={`${inputClass} mt-1.5`} />
        </label>
      </div>
      {state?.error && <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{state.error}</p>}
      {state?.success && <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">Profile saved.</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-electric-mix px-5 text-sm font-semibold text-veritas-bg disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function Field({ label, value, readOnly }: { label: string; value: string; readOnly?: boolean }) {
  return (
    <label className="block text-xs font-medium text-slate-400">
      {label}
      <input defaultValue={value} readOnly={readOnly} className={`${inputClass} mt-1.5 text-slate-400`} />
    </label>
  );
}
