import { EmptyState } from "@/components/shared/empty-state";
import type { AnalyticsStreaks } from "@/lib/api/types";
import { getHabitColor } from "@/lib/habit-colors";

type StreakEntry = AnalyticsStreaks["habits"][number];

export function StreakLeaderboard({ habits }: { habits: StreakEntry[] }) {
  const sorted = [...habits].sort((a, b) => b.currentStreak - a.currentStreak);

  return (
    <section className="rounded-2xl border bg-card p-6">
      <h3 className="font-display text-xl font-semibold">Streak leaderboard</h3>
      <p className="mt-1 text-sm text-muted-foreground">Current and personal best per habit.</p>

      {sorted.length === 0 ? (
        <EmptyState className="mt-4 rounded-xl p-8">No streaks yet.</EmptyState>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {sorted.map((entry) => (
            <li key={entry.habitId} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: getHabitColor(entry.color) }}
                />
                <p className="text-sm font-medium">{entry.name}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <p className="font-display text-lg font-semibold">{entry.currentStreak}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    current
                  </p>
                </div>
                <div className="text-right text-muted-foreground">
                  <p className="font-display text-lg font-semibold">{entry.longestStreak}</p>
                  <p className="text-[10px] uppercase tracking-wide">best</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
