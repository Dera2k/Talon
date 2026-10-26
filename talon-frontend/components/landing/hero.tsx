import Link from "next/link";
import { TalonMark } from "@/components/brand/talon-mark";
import { Button } from "@/components/ui/button";

const PREVIEW_STATS = [
  { k: "Grip streak", v: "27", sub: "Morning workout" },
  { k: "Today", v: "5 / 8", sub: "gripped" },
  { k: "This week", v: "82%", sub: "hold rate" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-noise">
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-28 md:pt-32 md:pb-36">
        <p className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="h-px w-8 bg-primary" />
          Habit tracker · v1
        </p>
        <h1 className="font-display text-[13vw] font-semibold leading-[0.88] tracking-[-0.04em] md:text-[112px]">
          Grip the day.
          <br />
          <span className="text-primary">Hold</span> the line.
        </h1>
        <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr,1fr] md:items-end">
          <p className="max-w-lg text-lg text-muted-foreground md:text-xl">
            Talon is a habit tracker for people who are done with confetti and cartoon streak
            flames. You perch, you grip, you keep the claw closed. Slip and the streak breaks. A
            day still pending? The branch holds.
          </p>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button size="lg" asChild>
              <Link href="/register">
                <TalonMark className="mr-2 h-4 w-4" /> Start gripping
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/app">See the perch</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-lg border bg-border/60 md:grid-cols-3">
          {PREVIEW_STATS.map((s) => (
            <div key={s.k} className="flex flex-col justify-between gap-8 bg-card p-6">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>{s.k}</span>
                <TalonMark className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="num font-display text-5xl font-semibold tracking-tight">{s.v}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
