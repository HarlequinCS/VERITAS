import { acceptInvite } from "@/app/actions/members";
import { AcceptInviteForm } from "@/components/accept-invite-form";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">Invite</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Join this workspace</h1>
      <p className="mt-2 text-sm text-slate-400">Sign in with the email address that received the invite, then accept it.</p>
      <AcceptInviteForm token={token} action={acceptInvite} />
    </main>
  );
}
