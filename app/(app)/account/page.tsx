import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { KeyRound, LogOut, UserRound } from "lucide-react";
import { signOutUser } from "@/app/actions/auth";

export default async function AccountPage() {
  const supabase = await createClient();
  let username = "User";
  let role = "Workspace";
  let email = "";
  let authMethod = "email";

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      email = user.email ?? "";
      authMethod = user.app_metadata?.provider ?? 'email'
      const { data: profile } = await supabase
        .from("users")
        .select("username, role")
        .eq("user_id", user.id)
        .single();
      if (profile?.username) username = profile.username;
      if (profile?.role) role = profile.role;
    }
  } catch {
    // fallback already set
  }

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">Account</p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">Workspace profile</h1>
      <section className="glass mt-8 rounded-2xl p-5">
        <UserRound className="h-7 w-7 text-veritas-electric" />
        <h2 className="mt-4 text-lg font-semibold text-white">{username}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {role} · {email || "Workspace"} · Signed in with {authMethod === 'google' ? 'Google' : authMethod === 'github' ? 'GitHub' : 'Email'}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Workspace roles are assigned by the workspace owner. The public scanner
          account is intentionally separate from the private founder operations console.
        </p>
        <div className="mt-5 flex items-center gap-2">
          <Link href="/settings" className="inline-flex items-center gap-2 rounded-lg border border-veritas-border-subtle px-4 py-2 text-sm text-slate-300 hover:border-veritas-electric/40 hover:text-white">
            <KeyRound className="h-4 w-4" /> Manage workspace settings
          </Link>
          <form action={signOutUser}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-veritas-border-subtle px-4 py-2 text-sm text-rose-300 transition hover:border-rose-400/40 hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
