import Link from "next/link";
import { TalonMark } from "@/components/brand/talon-mark";

export function PerchEmptyState() {
  return (
    <div className="rounded-xl border border-dashed bg-card/40 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
        <TalonMark className="h-6 w-6" />
      </div>
      <p className="mt-4 font-display text-lg font-semibold">The branch is bare.</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Add your first habit — get something to grip.
      </p>
      <Link
        href="/app/habits/new"
        className="mt-6 inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        <TalonMark className="h-3.5 w-3.5" /> Add a habit
      </Link>
    </div>
  );
}
