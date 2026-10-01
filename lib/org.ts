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
  isOwner: boolean;
  description: string | null;
  logoUrl: string | null;
  slug: string | null;
};

export function canManageMembers(role: string | null | undefined) {
  return role === "owner" || role === "admin";
}

export type OrgMembership = {
  orgId: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  role: OrgRole;
  status: string;
  requireMfa: boolean;
};

export async function listMyOrganizations(): Promise<OrgMembership[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("my_organizations");
  if (error || !data) return [];
  return (data as {
    org_id: string;
    name: string;
    slug: string;
    description: string | null;
    logo_url: string | null;
    role: OrgRole;
    status: string;
    require_mfa: boolean;
  }[]).map((row) => ({
    orgId: row.org_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    logoUrl: row.logo_url,
    role: row.role,
    status: row.status,
    requireMfa: row.require_mfa,
  }));
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

  const memberships = await listMyOrganizations();
  const activeOrgId = (user.user_metadata?.active_org_id as string | undefined) ?? null;
  const current = memberships.find((org) => org.orgId === activeOrgId) ?? memberships[0] ?? null;

  return {
    userId: user.id,
    email: profile?.email ?? user.email ?? "",
    displayName: profile?.display_name || profile?.username || "User",
    orgId: current?.orgId ?? null,
    orgName: current?.name ?? null,
    role: current?.role ?? null,
    status: current?.status ?? null,
    requireMfa: current?.requireMfa ?? false,
    canManageMembers: canManageMembers(current?.role),
    isOwner: current?.role === "owner",
    description: current?.description ?? null,
    logoUrl: current?.logoUrl ?? null,
    slug: current?.slug ?? null,
  };
}
