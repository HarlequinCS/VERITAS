import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getOrgContext } from "@/lib/org";
import { InviteForm } from "@/components/invite-form";
import { setMemberStatus, updateMemberRole } from "@/app/actions/members";
import { setRequireMfa } from "@/app/actions/security";

export default async function MembersPage() {
  const ctx = await getOrgContext();
  const supabase = await createClient();

  const { data: members } = ctx?.orgId
    ? await supabase.rpc("org_directory", { p_org: ctx.orgId })
    : { data: [] };

  const { data: events } = ctx?.canManageMembers && ctx.orgId
    ? await supabase
        .from("audit_events")
        .select("id, action, target, created_at, actor_id")
        .eq("org_id", ctx.orgId)
        .order("created_at", { ascending: false })
        .limit(30)
    : { data: [] };

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link href="/account" className="text-xs text-slate-500 hover:text-white">Back to account</Link>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">Members</p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">{ctx?.orgName ?? "Organization"}</h1>
      <p className="mt-2 text-sm text-slate-400">Roles are assigned here. A member cannot change their own role.</p>

      {ctx?.canManageMembers && (
        <section className="glass mt-8 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white">Invite</h2>
          <InviteForm />
          <form action={setRequireMfa} className="mt-6 flex items-center gap-3 text-sm text-slate-300">
            <input type="hidden" name="require_mfa" value={ctx.requireMfa ? "false" : "true"} />
            <button type="submit" className="rounded-lg border border-veritas-border-subtle px-3 py-2 hover:border-veritas-electric/40">
              {ctx.requireMfa ? "Stop requiring MFA" : "Require MFA for this organization"}
            </button>
          </form>
        </section>
      )}

      <section className="glass mt-6 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white">People</h2>
        <ul className="mt-4 space-y-3">
          {(members ?? []).map((member: {
            user_id: string;
            email: string;
            display_name: string | null;
            username: string;
            role: string;
            status: string;
          }) => {
            const isSelf = member.user_id === ctx?.userId;
            return (
              <li key={member.user_id} className="rounded-xl border border-veritas-border-subtle px-3 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-white">{member.display_name || member.username || member.email}</p>
                    <p className="text-xs text-slate-500">{member.email} · {member.status}</p>
                  </div>
                  <span className="text-slate-400">{member.role}</span>
                </div>
                {ctx?.canManageMembers && !isSelf && member.role !== "owner" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <form action={updateMemberRole} className="flex gap-2">
                      <input type="hidden" name="user_id" value={member.user_id} />
                      <select name="role" defaultValue={member.role} className="h-9 rounded-lg border border-veritas-border-subtle bg-veritas-surface/50 px-2 text-xs text-white">
                        <option value="admin">admin</option>
                        <option value="analyst">analyst</option>
                        <option value="developer">developer</option>
                        <option value="viewer">viewer</option>
                      </select>
                      <button type="submit" className="h-9 rounded-lg border border-veritas-border-subtle px-3 text-xs text-slate-200">Update role</button>
                    </form>
                    <form action={setMemberStatus}>
                      <input type="hidden" name="user_id" value={member.user_id} />
                      <input type="hidden" name="status" value={member.status === "suspended" ? "active" : "suspended"} />
                      <button type="submit" className="h-9 rounded-lg border border-veritas-border-subtle px-3 text-xs text-amber-200">
                        {member.status === "suspended" ? "Restore" : "Suspend"}
                      </button>
                    </form>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {ctx?.canManageMembers && (
        <section className="glass mt-6 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white">Audit log</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            {(events ?? []).length === 0 && <li>No events yet.</li>}
            {(events ?? []).map((event: { id: string; action: string; target: string | null; created_at: string }) => (
              <li key={event.id} className="flex justify-between gap-3 border-b border-veritas-border-subtle/60 py-2">
                <span>{event.action}{event.target ? ` · ${event.target}` : ""}</span>
                <span className="shrink-0 text-xs text-slate-500">{new Date(event.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
