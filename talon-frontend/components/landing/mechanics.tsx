import { ArrowUpRight } from "lucide-react";

const FEATURES = [
  { t: "Strict streaks", body: "Slip and it breaks. A day still pending never does." },
  { t: "Flexible schedules", body: "Daily, or the weekdays you choose." },
  {
    t: "Local-time reminders",
    body: "One reminder per habit, at your time, in your timezone.",
  },
  {
    t: "Real analytics",
    body: "90-day heatmap. Best days, worst days. Per-habit grip history.",
  },
  { t: "One tap", body: "Optimistic. No modal to close a habit. The grip lands instantly." },
  { t: "Catch up", body: "Missed a day? Log today or any of the last seven." },
];

export function Mechanics() {
  return (
    <section className="border-b border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
              § 02 — Mechanics
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Every feature earns its place on the branch.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Six things. Nothing extra. No streak bribery, no shame notifications.
          </p>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border bg-border/60 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.t}
              className="group flex flex-col gap-3 bg-card p-6 transition hover:bg-card/60"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-semibold">{f.t}</h3>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
