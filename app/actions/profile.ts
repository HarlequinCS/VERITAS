"use server";

import { createClient } from "@/utils/supabase/server";
import { writeAudit } from "@/lib/audit";
import { sendWelcomeEmail } from "@/lib/welcome-email";

type ProfileResult = { error?: string; success?: boolean } | null;

export async function updateProfile(
  _prevState: ProfileResult,
  formData: FormData,
): Promise<ProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthenticated." };
  const firstSetup = user.user_metadata?.onboarded !== true;

  const displayName = (formData.get("username") as string)?.trim();
  const jobTitle = ((formData.get("job_title") as string) ?? "").trim();
  const phone = ((formData.get("phone") as string) ?? "").trim();
  const timezone = ((formData.get("timezone") as string) ?? "").trim();
  const locale = ((formData.get("locale") as string) ?? "").trim();

  if (!displayName || displayName.length < 2) return { error: "Display name is required." };
  if (displayName.length > 40) return { error: "Display name must be 40 characters or fewer." };

  const { data: updated, error: dbErr } = await supabase
    .from("users")
    .update({
      display_name: displayName,
      username: displayName,
      job_title: jobTitle || null,
      phone: phone || null,
      timezone: timezone || null,
      locale: locale || null,
    })
    .eq("user_id", user.id)
    .select("user_id");

  if (dbErr) return { error: dbErr.message };
  if (!updated || updated.length === 0) return { error: "Profile could not be saved. Please try again." };

  const { error: metaErr } = await supabase.auth.updateUser({
    data: { onboarded: true },
  });
  if (metaErr) return { error: metaErr.message };

  await writeAudit("profile.update", user.id, { display_name: displayName });

  if (firstSetup && user.email) {
    const provider = user.app_metadata?.provider;
    const method = provider === "github" ? "GitHub" : provider === "google" ? "Google" : "Email & Password";
    sendWelcomeEmail({ email: user.email, username: displayName, method }).catch((error) => {
      console.error("[updateProfile] welcome email error:", error);
    });
  }

  return { success: true };
}
