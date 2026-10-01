import Link from "next/link";
import { KeyRound, LogOut, ShieldCheck, Users } from "lucide-react";
import { signOutUser } from "@/app/actions/auth";
import { revokeOtherSessions } from "@/app/actions/security";
import { switchOrg } from "@/app/actions/members";
import { ProfileEditor } from "@/components/profile-editor";
import { createClient } from "@/utils/supabase/server";
import { getOrgContext } from "@/lib/org";

type SessionRow = { id: string; user_agent?: string | null; ip?: string | null; created_at?: string | null };

async function listSessions(userId: string | undefined): Promise<SessionRow[] | null> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!key || !url || !userId) return null;
  const response = await fetch(`${url}/auth/v1/admin/users/${userId}/sessions`, {
    headers: { Authorization: `Bearer ${key}`, apikey: key },
    cache: "no-store",
  });
  if (!response.ok) return [];
  const body = await response.json();
  const rows = Array.isArray(body) ? body : body.sessions;
  if (!Array.isArray(rows)) return [];
  return rows.map((row: SessionRow) => ({
    id: row.id,
    user_agent: row.user_agent,
    ip: row.ip,
    created_at: row.created_at,
  }));
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const ctx = await getOrgContext();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("users")
        .select("display_name, username, job_title, phone, timezone, locale, email")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const { data: memberships } = user
    ? await supabase
        .from("memberships")
        .select("org_id, role, status, organizations(name)")
        .eq("user_id", user.id)
    : { data: [] };

  const roleLabel = ctx?.role ? `${ctx.role}${ctx.orgName ? ` · ${ctx.orgName}` : ""}` : "No active organization";
  const sessions = await listSessions(user?.id);

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">Account</p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">Workspace profile</h1>
      {params.status === "suspended" && (
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          This membership is suspended. An owner or admin has to restore it before the workspace opens.
        </p>
      )}
      <section className="glass mt-8 rounded-2xl p-5">
        <ProfileEditor
          email={profile?.email || ctx?.email || ""}
          displayName={profile?.display_name || profile?.username || ""}
          jobTitle={profile?.job_title || ""}
          phone={profile?.phone || ""}
          timezone={profile?.timezone || ""}
          locale={profile?.locale || ""}
          roleLabel={roleLabel}
        />
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link href="/account/security" className="inline-flex items-center gap-2 rounded-lg border border-veritas-border-subtle px-4 py-2 text-sm text-slate-300 hover:border-veritas-electric/40 hover:text-white">
            <ShieldCheck className="h-4 w-4" /> Security
          </Link>
          <Link href="/account/members" className="inline-flex items-center gap-2 rounded-lg border border-veritas-border-subtle px-4 py-2 text-sm text-slate-300 hover:border-veritas-electric/40 hover:text-white">
            <Users className="h-4 w-4" /> Members
          </Link>
          <Link href="/settings" className="inline-flex items-center gap-2 rounded-lg border border-veritas-border-subtle px-4 py-2 text-sm text-slate-300 hover:border-veritas-electric/40 hover:text-white">
            <KeyRound className="h-4 w-4" /> Scanner settings
          </Link>
          <form action={signOutUser}>
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg border border-veritas-border-subtle px-4 py-2 text-sm text-rose-300 hover:border-rose-400/40 hover:bg-rose-500/10">
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </form>
        </div>
      </section>

      <section className="glass mt-6 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white">Organizations</h2>
        <ul className="mt-4 space-y-2">
          {(memberships ?? []).map((row: {
            org_id: string;
            role: string;
            status: string;
            organizations: { name: string } | { name: string }[] | null;
          }) => {
            const org = row.organizations as { name: string } | { name: string }[] | null;
            const name = Array.isArray(org) ? org[0]?.name : org?.name;
            return (
              <li key={row.org_id} className="flex items-center justify-between gap-3 rounded-xl border border-veritas-border-subtle px-3 py-2 text-sm">
                <span className="text-slate-200">{name ?? row.org_id}</span>
                <span className="text-slate-500">{row.role} · {row.status}</span>
                {row.status === "active" && row.org_id !== ctx?.orgId && (
                  <form action={switchOrg}>
                    <input type="hidden" name="org_id" value={row.org_id} />
                    <button type="submit" className="text-veritas-electric">Switch</button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="glass mt-6 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white">Sessions</h2>
        <p className="mt-2 text-sm text-slate-400">
          This browser is signed in as {ctx?.email || "your account"}. Other devices stay signed in until you revoke them.
        </p>
        {sessions && sessions.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {sessions.map((session) => (
              <li key={session.id} className="rounded-lg border border-veritas-border-subtle px-3 py-2">
                <span className="block text-white">{session.user_agent || "Unknown device"}</span>
                <span className="text-xs text-slate-500">{session.ip || "IP hidden"} · {session.created_at ? new Date(session.created_at).toLocaleString() : "active"}</span>
              </li>
            ))}
          </ul>
        )}
        <form action={revokeOtherSessions} className="mt-4">
          <button type="submit" className="inline-flex h-10 items-center rounded-lg border border-veritas-border-subtle px-4 text-sm text-slate-200 hover:border-rose-400/40">
            Sign out other sessions
          </button>
        </form>
      </section>
    </main>
  );
}
