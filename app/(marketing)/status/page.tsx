import { CheckCircle2, Server } from "lucide-react";

export default function StatusPage() {
  return (
    <main className="min-h-dvh px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <p className="font-label text-xs uppercase tracking-[0.2em] text-veritas-electric">Platform Status</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">All customer systems operational.</h1>
        <div className="mt-10 space-y-3">
          {["Scanner API", "Celery workers", "Redis broker", "Report studio", "CISA KEV feed"].map((service) => (
            <div key={service} className="glass flex items-center justify-between rounded-xl p-4">
              <span className="flex items-center gap-3 text-sm text-white"><Server className="h-4 w-4 text-veritas-electric" />{service}</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-300"><CheckCircle2 className="h-4 w-4" />Operational</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
