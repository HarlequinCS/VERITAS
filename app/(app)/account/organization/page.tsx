import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getOrgContext, listMyOrganizations } from "@/lib/org";
import { CreateOrgForm, DeleteOrgForm, EditOrgForm } from "@/components/org-forms";
import { switchOrg } from "@/app/actions/members";

export default async function OrganizationPage() {
  const ctx = await getOrgContext();
  const memberships = await listMyOrganizations();
  const supabase = await createClient();
  const { data: events } = ctx?.orgId
    ? await supabase
        .from("audit_events")
        .select("id, action, target, created_at")
        .eq("org_id", ctx.orgId)
        .order("created_at", { ascending: false })
        .limit(15)
    : { data: [] };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link href="/account" className="text-sm text-slate-300 hover:text-white">Back to account</Link>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-veritas-electric">Organization</p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">{ctx?.orgName ?? "Your organizations"}</h1>

      <section className="glass mt-8 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white">Your organizations</h2>
        <ul className="mt-4 space-y-3">
          {memberships.length === 0 && <li className="text-base text-slate-300">You do not belong to an organization yet. Create one below.</li>}
          {memberships.map((org) => {
            const active = org.orgId === ctx?.orgId;
            return (
              <li key={org.orgId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-veritas-border-subtle px-3 py-3 text-base">
                <span className="text-white">{org.name} <span className="text-slate-300">· {org.slug} · {org.role}</span></span>
                {active ? <span className="text-sm text-emerald-300">Active · you are {org.role}</span> : (
                  <form action={switchOrg}>
                    <input type="hidden" name="org_id" value={org.orgId} />
                    <button type="submit" className="h-11 rounded-lg border border-veritas-border-subtle px-3 text-sm text-slate-200">Make active</button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {ctx?.orgId && (
        <section className="glass mt-8 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          {ctx.logoUrl && <p className="mt-4 break-all text-sm text-slate-300">Logo: {ctx.logoUrl}</p>}
          <dl className="mt-4 space-y-2 text-base text-slate-300">
            <div>Slug: <span className="text-white">{ctx.slug}</span></div>
            <div>Your role: <span className="text-white">{ctx.role}</span></div>
            <div>{ctx.description || "No description yet."}</div>
          </dl>
          <Link href="/account/members" className="mt-4 inline-flex text-veritas-electric">Manage members and invites</Link>
          {ctx.isOwner && (
            <>
              <h3 className="mt-8 text-base font-semibold text-white">Edit</h3>
              <EditOrgForm name={ctx.orgName ?? ""} description={ctx.description ?? ""} logoUrl={ctx.logoUrl ?? ""} />
              <h3 className="mt-8 text-base font-semibold text-rose-200">Delete</h3>
              <DeleteOrgForm name={ctx.orgName ?? ""} />
            </>
          )}
          {!ctx.isOwner && (
            <p className="mt-4 text-base text-slate-300">Only the owner can edit or delete this organization.</p>
          )}
        </section>
      )}

      <section className="glass mt-6 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white">Create another organization</h2>
        <p className="mt-2 text-base text-slate-300">You become the owner. The new organization becomes your active workspace.</p>
        <CreateOrgForm />
      </section>

      {ctx?.canManageMembers && (
        <section className="glass mt-6 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {(events ?? []).length === 0 && <li>No activity yet.</li>}
            {(events ?? []).map((event: { id: string; action: string; target: string | null; created_at: string }) => (
              <li key={event.id} className="flex justify-between gap-3 border-b border-veritas-border-subtle/60 py-2">
                <span>{event.action}{event.target ? ` · ${event.target}` : ""}</span>
                <span className="text-slate-400">{new Date(event.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
