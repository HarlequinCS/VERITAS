import { createClient } from "@/utils/supabase/server";

export const ROLES = ["owner", "admin", "analyst", "developer", "viewer"] as const;
export type OrgRole = (typeof ROLES)[number];

export type OrgContext = {
  userId: string;
  email: string;
  displayName: string;
  orgId: string | null;
  orgName: string | null;
  role: OrgRole | null;
  status: string | null;
  requireMfa: boolean;
  canManageMembers: boolean;
};

export function canManageMembers(role: string | null | undefined) {
  return role === "owner" || role === "admin";
}

export async function getOrgContext(): Promise<OrgContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("username, display_name, email")
    .eq("user_id", user.id)
    .maybeSingle();

  const activeOrgId = (user.user_metadata?.active_org_id as string | undefined) ?? null;

  let membershipQuery = supabase
    .from("memberships")
    .select("org_id, role, status, organizations(name, require_mfa)")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (activeOrgId) membershipQuery = membershipQuery.eq("org_id", activeOrgId);

  const { data: membership } = await membershipQuery.limit(1).maybeSingle();

  const org = membership?.organizations as
    | { name: string; require_mfa: boolean }
    | { name: string; require_mfa: boolean }[]
    | null
    | undefined;
  const orgRow = Array.isArray(org) ? org[0] : org;
  const role = (membership?.role as OrgRole | undefined) ?? null;

  return {
    userId: user.id,
    email: profile?.email ?? user.email ?? "",
    displayName: profile?.display_name || profile?.username || "User",
    orgId: membership?.org_id ?? null,
    orgName: orgRow?.name ?? null,
    role,
    status: membership?.status ?? null,
    requireMfa: Boolean(orgRow?.require_mfa),
    canManageMembers: canManageMembers(role),
  };
}
