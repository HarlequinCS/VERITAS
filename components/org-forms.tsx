"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrganization, deleteOrganization, updateOrganization } from "@/app/actions/members";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 px-3.5 text-base text-white outline-none";

export function CreateOrgForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(createOrganization, null);
  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);
  return (
    <form action={action} className="mt-4 space-y-3">
      <label className="block text-sm text-slate-300">Name<input name="name" required maxLength={80} className={inputClass} /></label>
      <label className="block text-sm text-slate-300">Slug<input name="slug" required maxLength={60} placeholder="acme-security" className={inputClass} /></label>
      <label className="block text-sm text-slate-300">Description<textarea name="description" maxLength={400} className={`${inputClass} h-24 py-2`} /></label>
      {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-emerald-300">
          Organization created and set as your active workspace. Next,{" "}
          <Link href="/account/members" className="text-veritas-electric">invite members</Link>.
        </p>
      )}
      <button type="submit" disabled={pending} className="inline-flex h-11 items-center rounded-lg bg-electric-mix px-4 text-base font-semibold text-veritas-bg disabled:opacity-50">
        {pending ? "Creating…" : "Create organization"}
      </button>
    </form>
  );
}

export function EditOrgForm({
  name,
  description,
  logoUrl,
}: {
  name: string;
  description: string;
  logoUrl: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateOrganization, null);
  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);
  return (
    <form action={action} className="mt-4 space-y-3">
      <label className="block text-sm text-slate-300">Name<input name="name" required maxLength={80} defaultValue={name} className={inputClass} /></label>
      <label className="block text-sm text-slate-300">Description<textarea name="description" maxLength={400} defaultValue={description} className={`${inputClass} h-24 py-2`} /></label>
      <label className="block text-sm text-slate-300">Logo URL<input name="logo_url" type="url" defaultValue={logoUrl} placeholder="https://example.com/logo.png" className={inputClass} /></label>
      {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-300">Organization updated.</p>}
      <button type="submit" disabled={pending} className="inline-flex h-11 items-center rounded-lg bg-electric-mix px-4 text-base font-semibold text-veritas-bg disabled:opacity-50">
        {pending ? "Saving…" : "Save organization"}
      </button>
    </form>
  );
}

export function DeleteOrgForm({ name }: { name: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(deleteOrganization, null);
  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);
  return (
    <form action={action} className="mt-4 space-y-3">
      <p className="text-base text-slate-300">Type <span className="text-white">{name}</span> to delete this organization. Members lose access. Scan records stay on each user account.</p>
      <input name="confirm" required className={inputClass} placeholder={name} />
      {state?.error && <p className="text-sm text-rose-300">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-300">Organization deleted.</p>}
      <button type="submit" disabled={pending} className="inline-flex h-11 items-center rounded-lg border border-rose-400/40 px-4 text-base text-rose-200 disabled:opacity-50">
        {pending ? "Deleting…" : "Delete organization"}
      </button>
    </form>
  );
}
