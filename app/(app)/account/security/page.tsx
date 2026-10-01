import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { MfaEnrollment } from "@/components/mfa-enrollment";
import { unenrollTotp } from "@/app/actions/security";

export default async function SecurityPage() {
  const supabase = await createClient();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const verified = factors?.totp?.filter((factor) => factor.status === "verified") ?? [];

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link href="/account" className="text-xs text-slate-500 hover:text-white">Back to account</Link>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">Security</p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">Sign-in protection</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-400">
        Password and email changes stay in Supabase Auth. Use the authenticator app below when your organization requires MFA. Recovery codes are issued by the authenticator enrollment flow.
      </p>

      <section className="glass mt-8 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-white">Authenticator app</h2>
        <MfaEnrollment enrolled={verified.length > 0} />
        {verified.map((factor) => (
          <form key={factor.id} action={unenrollTotp} className="mt-3">
            <input type="hidden" name="factor_id" value={factor.id} />
            <button type="submit" className="text-sm text-rose-300">Remove {factor.friendly_name || "authenticator"}</button>
          </form>
        ))}
      </section>

      <section className="glass mt-6 rounded-2xl p-5 text-sm text-slate-400">
        <h2 className="text-lg font-semibold text-white">Password and email</h2>
        <p className="mt-2">Change your password from the sign-in page after requesting a reset. Email changes require confirmation from Supabase Auth and are not stored as a second copy in the profile table.</p>
        <Link href="/forgot-password" className="mt-3 inline-flex text-veritas-electric">Reset password</Link>
      </section>
    </main>
  );
}
