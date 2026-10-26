"use client";

import { ArrowRight, Check, SkipForward, Target } from "lucide-react";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { GripRateCard } from "@/components/dashboard/grip-rate-card";
import { PerchEmptyState } from "@/components/dashboard/perch-empty-state";
import { SkippedList } from "@/components/dashboard/skipped-list";
import { HabitCard } from "@/components/habits/habit-card";
import { QueryError } from "@/components/shared/query-error";
import { StatCard } from "@/components/shared/stat-card";
import { useDashboard } from "@/hooks/queries/use-dashboard";
import { useMe } from "@/hooks/queries/use-me";
import { formatDate } from "@/lib/format";

const NO_REMINDER = "99:99";

export function DashboardView() {
  const dashboard = useDashboard();
  const { data: me } = useMe();

  if (dashboard.isPending) return <DashboardSkeleton />;

  if (dashboard.isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <QueryError
          message="Couldn’t load your day."
          onRetry={() => void dashboard.refetch()}
        />
      </div>
    );
  }

  const { date, summary, habits } = dashboard.data;

  const completed = habits.filter((habit) => habit.status === "completed");
  const skipped = habits.filter((habit) => habit.status === "skipped");
  const pending = habits
    .filter((habit) => habit.status === null)
    .sort((a, b) => (a.reminderTime ?? NO_REMINDER).localeCompare(b.reminderTime ?? NO_REMINDER));
  const ordered = [...completed, ...pending];

  const rate = summary.total ? Math.round((summary.completed / summary.total) * 100) : 0;

  const phrase =
    summary.total === 0 ? "the branch is bare." : `${summary.pending} left to grip.`;
  const greeting = me?.firstName
    ? `${me.firstName}, ${phrase}`
    : phrase.charAt(0).toUpperCase() + phrase.slice(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            The Perch · {formatDate(date, "EEE, MMM d")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {greeting}
          </h2>
        </div>
        <Link
          href="/app/analytics"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          Open analytics <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Gripped"
          value={`${summary.completed}/${summary.total}`}
          icon={Check}
          tint="text-primary"
        />
        <StatCard
          label="On branch"
          value={String(summary.pending)}
          icon={Target}
          tint="text-muted-foreground"
        />
        <StatCard
          label="Slipped"
          value={String(summary.skipped)}
          icon={SkipForward}
          tint="text-warning"
        />
        <GripRateCard rate={rate} />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">Today</h3>
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="num">{summary.completed}</span> of{" "}
            <span className="num">{summary.total}</span> gripped
          </p>
        </div>

        {ordered.length === 0 ? (
          <PerchEmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {ordered.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                status={habit.status}
                streak={habit.currentStreak}
              />
            ))}
          </div>
        )}

        <SkippedList habits={skipped} />
      </section>
    </div>
  );
}
