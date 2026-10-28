"use client";

import { Flame } from "lucide-react";
import { useHabitHistory } from "@/hooks/queries/use-completions";
import { useHabitStreak } from "@/hooks/queries/use-streaks";
import { formatDate } from "@/lib/format";

export function StreakStats({ habitId }: { habitId: string }) {
  const streak = useHabitStreak(habitId);
  const history = useHabitHistory(habitId);

  const current = streak.data?.currentStreak;
  const lastDate = streak.data?.lastCompletedDate;

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <Flame className="h-3.5 w-3.5 text-warning" /> Current streak
        </div>
        <p className="mt-3 font-display text-4xl font-semibold">{current ?? "–"}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {lastDate ? `Last gripped ${formatDate(lastDate, "MMM d")}` : "No active streak"}
        </p>
      </div>
      <div className="rounded-2xl border bg-card p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Longest streak</div>
        <p className="mt-3 font-display text-4xl font-semibold">
          {streak.data?.longestStreak ?? "–"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">personal best</p>
      </div>
      <div className="rounded-2xl border bg-card p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Days logged</div>
        <p className="mt-3 font-display text-4xl font-semibold">
          {history.data?.meta.total ?? "–"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">all time</p>
      </div>
    </div>
  );
}
