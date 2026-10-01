import { CommandBar } from "@/components/command-bar";
import { PrimarySidebar } from "@/components/primary-sidebar";
import { AIAssistantDock } from "@/components/ai-assistant-dock";
import { getOrgContext } from "@/lib/org";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let username = "User";
  let role = "Workspace";

  try {
    const ctx = await getOrgContext();
    if (ctx) {
      username = ctx.displayName;
      role = ctx.role ? `${ctx.role}${ctx.orgName ? ` · ${ctx.orgName}` : ""}` : role;
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
