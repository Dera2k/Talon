import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TalonMark } from "@/components/brand/talon-mark";
import { PreviewStats } from "@/components/landing/preview-stats";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-noise">
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-28 md:pt-32 md:pb-36">
        <p className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-700">
          <span className="h-px w-8 bg-primary" />
          Habit tracker · v1
        </p>
        <h1 className="font-display text-[13vw] font-semibold leading-[0.88] tracking-[-0.04em] md:text-[112px] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
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

        <PreviewStats />
      </div>
    </section>
  );
}
