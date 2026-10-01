export function LiveActivityRail() {
  return (
    <section className="glass flex h-full flex-col overflow-hidden rounded-2xl">
      <header className="border-b border-veritas-border-subtle/70 px-5 py-4">
        <h3 className="text-base font-semibold text-white">Scan activity</h3>
        <p className="mt-1 text-sm text-slate-300">Events from your workspace appear here.</p>
      </header>
      <p className="px-5 py-8 text-base leading-relaxed text-slate-300">
        No scan activity yet. Start a scan to see its status in this list.
      </p>
    </section>
  );
}
