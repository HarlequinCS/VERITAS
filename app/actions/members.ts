"use server";

import { createHash, randomBytes } from "crypto";
import { createClient } from "@/utils/supabase/server";
import { getOrgContext } from "@/lib/org";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/mailer";

type ActionResult = { error?: string; success?: boolean; link?: string };

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function inviteMember(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const ctx = await getOrgContext();
  if (!ctx?.orgId || !ctx.canManageMembers) return { error: "Only an owner or admin can invite members." };

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const role = (formData.get("role") as string)?.trim();
  if (!email || !email.includes("@")) return { error: "A valid email is required." };
  if (!["admin", "analyst", "developer", "viewer"].includes(role)) return { error: "Invalid role." };

  const token = randomBytes(24).toString("hex");
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_invitation", {
    p_org: ctx.orgId,
    p_email: email,
    p_role: role,
    p_token_hash: hashToken(token),
  });
  if (error) return { error: error.message };

  const link = `https://scanwithveritas.tech/invite/${token}`;
  try {
    await sendEmail({
      to: email,
      subject: `You're invited to ${ctx.orgName ?? "a VERITAS workspace"}`,
      html: `<p>You have been invited to join <strong>${ctx.orgName ?? "a VERITAS workspace"}</strong> as ${role}.</p><p><a href="${link}">Accept invite</a></p><p>This link expires in 7 days.</p>`,
    });
  } catch {
    // Mail is optional. The admin can copy the link from the form result.
  }

  await writeAudit("member.invite", email, { role }, ctx.orgId);
  return { success: true, link };
}

export async function acceptInvite(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const token = (formData.get("token") as string)?.trim();
  if (!token) return { error: "Missing invite token." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("accept_invitation", {
    p_token_hash: hashToken(token),
  });
  if (error) return { error: error.message };

  const orgId = data as string;
  await supabase.auth.updateUser({ data: { active_org_id: orgId } });
  await writeAudit("member.accept", orgId, {}, orgId);
  return { success: true };
}

export async function updateMemberRole(formData: FormData) {
  const ctx = await getOrgContext();
  if (!ctx?.orgId || !ctx.canManageMembers) return;

  const userId = formData.get("user_id") as string;
  const role = formData.get("role") as string;
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_member_role", {
    p_org: ctx.orgId,
    p_user: userId,
    p_role: role,
  });
  if (!error) await writeAudit("member.role", userId, { role }, ctx.orgId);
}

export async function setMemberStatus(formData: FormData) {
  const ctx = await getOrgContext();
  if (!ctx?.orgId || !ctx.canManageMembers) return;

  const userId = formData.get("user_id") as string;
  const status = formData.get("status") as string;
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_member_status", {
    p_org: ctx.orgId,
    p_user: userId,
    p_status: status,
  });
  if (!error) await writeAudit("member.status", userId, { status }, ctx.orgId);
}

export async function switchOrg(formData: FormData) {
  const orgId = formData.get("org_id") as string;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !orgId) return;

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .eq("org_id", orgId)
    .eq("status", "active")
    .maybeSingle();
  if (!membership) return;

  await supabase.auth.updateUser({ data: { active_org_id: orgId } });
  await writeAudit("org.switch", orgId, {}, orgId);
}
