import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function writeAudit(action: string, target?: string, metadata?: Record<string, unknown>, orgId?: string) {
  const supabase = await createClient();
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  await supabase.rpc("write_audit", {
    p_action: action,
    p_target: target ?? null,
    p_metadata: metadata ?? {},
    p_ip: ip,
    p_org: orgId ?? null,
  });
}
