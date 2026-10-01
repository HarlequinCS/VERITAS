import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { MfaEnrollment } from "@/components/mfa-enrollment";
import { SetPasswordForm } from "@/components/set-password-form";
import { unenrollTotp } from "@/app/actions/security";
import { linkProvider } from "@/app/actions/auth";

const METHOD_LABELS: Record<string, string> = {
  email: "Email and password",
  google: "Google",
  github: "GitHub",
};

export default async function SecurityPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const verified = factors?.totp?.filter((factor) => factor.status === "verified") ?? [];
  const providers = new Set((user?.identities ?? []).map((identity) => identity.provider));
  const hasEmail = providers.has("email");
  const connected = ["email", "google", "github"].filter((provider) => providers.has(provider));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link href="/account" className="text-sm text-slate-300 hover:text-white">Back to account</Link>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-veritas-electric">Security</p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">Sign-in protection</h1>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-300">
        One email is one account. Password, Google, and GitHub are ways to sign in to that same account.
      </p>
      {params.error && (
        <p className="mt-4 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {params.error} Use the method already connected to this email, then add the other one here.
        </p>
      )}

      <section className="glass mt-8 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white">Sign-in methods</h2>
        <ul className="mt-4 space-y-2 text-base text-slate-200">
          {connected.length === 0 && <li>No sign-in method is recorded on this session.</li>}
          {connected.map((provider) => (
            <li key={provider}>{METHOD_LABELS[provider] ?? provider}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {!providers.has("google") && (
            <form action={linkProvider}>
              <input type="hidden" name="provider" value="google" />
              <button type="submit" className="inline-flex h-11 items-center rounded-lg border border-veritas-border-subtle px-4 text-base text-slate-200 hover:border-veritas-electric/40">
                Connect Google
              </button>
            </form>
          )}
          {!providers.has("github") && (
            <form action={linkProvider}>
              <input type="hidden" name="provider" value="github" />
              <button type="submit" className="inline-flex h-11 items-center rounded-lg border border-veritas-border-subtle px-4 text-base text-slate-200 hover:border-veritas-electric/40">
                Connect GitHub
              </button>
            </form>
          )}
        </div>
        {!hasEmail && (
          <div className="mt-6 border-t border-veritas-border-subtle pt-6">
            <h3 className="text-base font-semibold text-white">Add a password</h3>
            <p className="mt-2 max-w-xl text-base text-slate-300">
              This account signs in with Google or GitHub. Save a password if you also want to use the email form.
            </p>
            <SetPasswordForm />
          </div>
        )}
        {hasEmail && (
          <p className="mt-4 text-base text-slate-300">
            To change the password you already have, use the reset page.{" "}
            <Link href="/forgot-password" className="text-veritas-electric">Reset password</Link>
          </p>
        )}
      </section>

      <section className="glass mt-6 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white">Authenticator app</h2>
        <MfaEnrollment enrolled={verified.length > 0} />
        {verified.map((factor) => (
          <form key={factor.id} action={unenrollTotp} className="mt-3">
            <input type="hidden" name="factor_id" value={factor.id} />
            <button type="submit" className="text-sm text-rose-300">Remove {factor.friendly_name || "authenticator"}</button>
          </form>
        ))}
      </section>
    </main>
  );
}
