import { createClient } from "@/utils/supabase/server";
import { CommandBar } from "@/components/command-bar";
import { PrimarySidebar } from "@/components/primary-sidebar";
import { AIAssistantDock } from "@/components/ai-assistant-dock";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let username = "User";
  let role = "Workspace";

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("username, role")
        .eq("user_id", user.id)
        .single();
      if (profile?.username) username = profile.username;
      if (profile?.role) role = profile.role;
    }
  } catch {
    // fallback already set
  }

  return (
    <div className="relative flex min-h-dvh">
      <PrimarySidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommandBar username={username} role={role} />
        <div className="flex-1">{children}</div>
      </div>
      <AIAssistantDock />
    </div>
  );
}
