import { acceptInvite, rejectInvite } from "@/app/actions/members";
import { AcceptInviteForm } from "@/components/accept-invite-form";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">Invite</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Join this workspace</h1>
      <p className="mt-2 text-base text-slate-300">Sign in or register with the email address that received this invite, then accept or decline it. The link expires in 7 days.</p>
      <AcceptInviteForm token={token} action={acceptInvite} />
      <AcceptInviteForm token={token} action={rejectInvite} label="Decline invite" />
    </main>
  );
}
