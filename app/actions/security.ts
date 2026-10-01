"use server";

import { createClient } from "@/utils/supabase/server";
import { getOrgContext } from "@/lib/org";
import { writeAudit } from "@/lib/audit";

type ActionResult = { error?: string; success?: boolean; factorId?: string; qr?: string; secret?: string };

export async function enrollTotp(): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Authenticator app",
  });
  if (error || !data) return { error: error?.message ?? "Could not start MFA enrollment." };
  return {
    success: true,
    factorId: data.id,
    qr: data.totp.qr_code,
    secret: data.totp.secret,
  };
}

export async function verifyTotp(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const factorId = formData.get("factor_id") as string;
  const code = (formData.get("code") as string)?.trim();
  if (!factorId || !code) return { error: "Enter the 6-digit code." };

  const supabase = await createClient();
  const challenge = await supabase.auth.mfa.challenge({ factorId });
  if (challenge.error || !challenge.data) return { error: challenge.error?.message ?? "Challenge failed." };

  const verified = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.data.id,
    code,
  });
  if (verified.error) return { error: verified.error.message };

  await writeAudit("mfa.enroll", factorId);
  return { success: true };
}

export async function unenrollTotp(formData: FormData) {
  const factorId = formData.get("factor_id") as string;
  if (!factorId) return;
  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (!error) await writeAudit("mfa.unenroll", factorId);
}

export async function revokeOtherSessions() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "others" });
  if (!error) await writeAudit("session.revoke_others");
}

export async function setRequireMfa(formData: FormData) {
  const ctx = await getOrgContext();
  if (!ctx?.orgId || !ctx.canManageMembers) return;
  const required = formData.get("require_mfa") === "true";
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_org_require_mfa", {
    p_org: ctx.orgId,
    p_required: required,
  });
  if (!error) await writeAudit("org.require_mfa", ctx.orgId, { require_mfa: required }, ctx.orgId);
}
