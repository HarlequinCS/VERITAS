"use server";

import { createHash, randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getOrgContext } from "@/lib/org";
import { writeAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/mailer";

type ActionResult = { error?: string; success?: boolean; link?: string };

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function refreshOrgViews() {
  revalidatePath("/", "layout");
  revalidatePath("/account");
  revalidatePath("/account/organization");
  revalidatePath("/account/members");
  revalidatePath("/dashboard");
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
  refreshOrgViews();
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
  await supabase.auth.refreshSession();
  await writeAudit("member.accept", orgId, {}, orgId);
  refreshOrgViews();
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
  if (!error) {
    await writeAudit("member.role", userId, { role }, ctx.orgId);
    refreshOrgViews();
  }
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
  if (!error) {
    await writeAudit("member.status", userId, { status }, ctx.orgId);
    refreshOrgViews();
  }
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
  await supabase.auth.refreshSession();
  await writeAudit("org.switch", orgId, {}, orgId);
  refreshOrgViews();
}

export async function createOrganization(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() ?? "";
  if (!name || !slug) return { error: "Name and slug are required." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_organization", {
    p_name: name,
    p_slug: slug,
    p_description: description,
  });
  if (error) return { error: error.message };
  const orgId = data as string;
  await supabase.auth.updateUser({ data: { active_org_id: orgId } });
  await supabase.auth.refreshSession();
  await writeAudit("org.create", orgId, { name }, orgId);
  refreshOrgViews();
  return { success: true, link: orgId };
}

export async function updateOrganization(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const ctx = await getOrgContext();
  if (!ctx?.orgId || !ctx.isOwner) return { error: "Only the owner can edit this organization." };
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() ?? "";
  const logoUrl = (formData.get("logo_url") as string)?.trim() ?? "";
  if (!name) return { error: "Organization name is required." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_organization", {
    p_org: ctx.orgId,
    p_name: name,
    p_description: description,
    p_logo_url: logoUrl,
  });
  if (error) return { error: error.message };
  await writeAudit("org.update", ctx.orgId, { name }, ctx.orgId);
  refreshOrgViews();
  return { success: true };
}

export async function deleteOrganization(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const ctx = await getOrgContext();
  if (!ctx?.orgId || !ctx.isOwner) return { error: "Only the owner can delete this organization." };
  const confirm = (formData.get("confirm") as string)?.trim();
  const supabase = await createClient();
  const { error } = await supabase.rpc("soft_delete_organization", {
    p_org: ctx.orgId,
    p_confirm: confirm,
  });
  if (error) return { error: error.message };
  await writeAudit("org.delete", ctx.orgId, {}, ctx.orgId);
  await supabase.auth.updateUser({ data: { active_org_id: null } });
  await supabase.auth.refreshSession();
  refreshOrgViews();
  return { success: true };
}

export async function revokeInvite(formData: FormData) {
  const ctx = await getOrgContext();
  if (!ctx?.orgId || !ctx.canManageMembers) return;
  const inviteId = formData.get("invite_id") as string;
  const supabase = await createClient();
  const { error } = await supabase.rpc("revoke_invitation", { p_invite: inviteId });
  if (!error) {
    await writeAudit("invite.revoke", inviteId, {}, ctx.orgId);
    refreshOrgViews();
  }
}

export async function resendInvite(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const ctx = await getOrgContext();
  if (!ctx?.orgId || !ctx.canManageMembers) return { error: "Only an owner or admin can resend an invite." };
  const inviteId = formData.get("invite_id") as string;
  const email = (formData.get("email") as string)?.trim();
  const token = randomBytes(24).toString("hex");
  const supabase = await createClient();
  const { error } = await supabase.rpc("resend_invitation", {
    p_invite: inviteId,
    p_token_hash: hashToken(token),
  });
  if (error) return { error: error.message };
  const link = `https://scanwithveritas.tech/invite/${token}`;
  if (email) {
    try {
      await sendEmail({
        to: email,
        subject: `Invitation to ${ctx.orgName ?? "a VERITAS workspace"}`,
        html: `<p>Your invitation link has been renewed.</p><p><a href="${link}">Open invite</a></p>`,
      });
    } catch {
      // The new link is returned to the admin if mail is not configured.
    }
  }
  await writeAudit("invite.resend", inviteId, {}, ctx.orgId);
  refreshOrgViews();
  return { success: true, link };
}

export async function rejectInvite(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const token = (formData.get("token") as string)?.trim();
  if (!token) return { error: "Missing invite token." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("reject_invitation", { p_token_hash: hashToken(token) });
  if (error) return { error: error.message };
  await writeAudit("invite.reject", "invitation", {});
  refreshOrgViews();
  return { success: true };
}
