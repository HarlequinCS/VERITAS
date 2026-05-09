import { CommandBar } from "@/components/command-bar";
import { PrimarySidebar } from "@/components/primary-sidebar";
import { AIAssistantDock } from "@/components/ai-assistant-dock";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh">
      <PrimarySidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CommandBar />
        <div className="flex-1">{children}</div>
      </div>
      <AIAssistantDock />
    </div>
  );
}
