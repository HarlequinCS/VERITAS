"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import { ArrowRight, Sparkles, User, Shield } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const ROLES = ["Analyst", "Lead", "Developer"] as const;

export function ProfileSetupForm({
  currentUsername,
  currentRole,
  email,
}: {
  currentUsername: string;
  currentRole: string;
  email: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateProfile, null);

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <div className="relative isolate flex min-h-dvh flex-col items-center justify-center bg-veritas-bg px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg animate-drift-grid opacity-40"
        style={{
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-veritas-electric/10 blur-[100px]"
      />

      <div className="glass-strong relative mx-auto w-full max-w-md animate-fade-up rounded-2xl p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-veritas-electric/15">
          <Sparkles className="h-6 w-6 text-veritas-electric" />
        </div>

        <h1 className="mt-5 text-center font-display text-xl font-bold text-white">
          Set up your profile
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Choose your display name and workspace role.
        </p>

        <form action={formAction} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Email
            </label>
            <div className="flex h-11 w-full items-center gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 px-3.5 text-sm text-slate-500">
              <MailIcon className="h-4 w-4 shrink-0 text-slate-600" />
              {email}
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              Display name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="username"
                name="username"
                type="text"
                required
                minLength={2}
                maxLength={40}
                defaultValue={currentUsername}
                className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-veritas-electric/50 focus:ring-1 focus:ring-veritas-electric/30"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              Role
            </label>
            <div className="relative">
              <Shield className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <select
                id="role"
                name="role"
                defaultValue={currentRole}
                className="h-11 w-full appearance-none rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 pl-10 pr-10 text-sm text-white outline-none transition focus:border-veritas-electric/50 focus:ring-1 focus:ring-veritas-electric/30"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-veritas-surface text-white">
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          {state?.error && (
            <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
          >
            {pending ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-veritas-bg border-t-transparent" />
            ) : (
              <>
                Continue to dashboard
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-veritas-border-subtle/60 pt-6">
          <BrandLogo variant="compact" />
        </div>
      </div>
    </div>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
