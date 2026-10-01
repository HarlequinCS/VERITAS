export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-veritas-electric">
        Workspace settings
      </p>
      <h1 className="mt-1.5 text-3xl font-semibold text-white">Scanner configuration</h1>
      <p className="mt-2 max-w-[40rem] text-base leading-relaxed text-slate-300">
        Scan policy, notification routing, and evidence retention are not available to change yet. Account security, members, and organization roles are managed from the account page.
      </p>
    </main>
  );
}