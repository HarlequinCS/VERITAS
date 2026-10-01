export function LiveTerminal() {
  return (
    <section className="glass rounded-2xl p-5">
      <h3 className="text-base font-semibold text-white">Scan log</h3>
      <p className="mt-2 text-base leading-relaxed text-slate-300">
        No scan is running. The log stays empty until a scan starts in this workspace.
      </p>
    </section>
  );
}
