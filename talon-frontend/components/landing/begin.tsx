import Link from "next/link";
import { TalonMark } from "@/components/brand/talon-mark";
import { Button } from "@/components/ui/button";

export function Begin() {
  return (
    <section id="start" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
              § 03 — Begin
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
              Grip the branch.
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-sm text-sm text-muted-foreground md:text-right">
              No signup friction. No upsells. Just you, your habits, and the claw.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">
                <TalonMark className="mr-2 h-4 w-4" /> Start gripping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
