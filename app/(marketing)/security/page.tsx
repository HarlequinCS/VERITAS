import type { Metadata } from "next";
import { MarketingActions } from "@/components/marketing-actions";

export const metadata: Metadata = {
  title: "VERITAS security",
  description:
    "VERITAS accounts use sign-in and optional MFA. Organizations use roles and an audit log. Each scan is modeled as an isolated browser context.",
};

export default function SecurityPage() {
  return (
    <main className="min-h-dvh px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl">
        <p className="font-label text-xs uppercase tracking-[0.2em] text-veritas-electric">Security</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">How access and scans are separated</h1>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-300">
          <p>Sign in with email and password, Google, or GitHub. An account can add an authenticator, and an organization can require one before members continue.</p>
          <p>An organization has an owner. Admins invite people and manage other roles. Analysts, developers, and viewers see the workspace according to that role. Membership changes are written to an audit log.</p>
          <p>A scan is run in an isolated browser context for a target you registered. The session is Pending, Processing, Completed, or Failed, and the finding stays with that session.</p>
        </div>
        <MarketingActions primaryHref="/platform" primaryLabel="Explore the platform" secondaryHref="/register" secondaryLabel="Create account" />
      </section>
    </main>
  );
}
