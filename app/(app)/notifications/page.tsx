export default function NotificationsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-veritas-electric">Notifications</p>
          <h1 className="mt-1.5 text-3xl font-semibold text-white">Workspace activity</h1>
          <p className="mt-2 max-w-[40rem] text-base leading-relaxed text-slate-300">
            No notifications yet. Findings and ticket updates for this workspace will be listed here.
          </p>
        </div>
      </div>
    </main>
  );
}
