"use client";

import { Calendar, Flame, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AnalyticsStreaks } from "@/lib/api/types";
import { AnalyticsSkeleton } from "@/components/analytics/analytics-skeleton";
import { Heatmap } from "@/components/analytics/heatmap";
import { StreakLeaderboard } from "@/components/analytics/streak-leaderboard";
import { WeekdaySection } from "@/components/analytics/weekday-section";
import { PageHeader } from "@/components/shared/page-header";
import { QueryError } from "@/components/shared/query-error";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsStreaks, useHeatmap } from "@/hooks/queries/use-analytics";
import { useDashboard } from "@/hooks/queries/use-dashboard";
import { buildDays, completionRate, getRange } from "@/lib/analytics";

const formatRate = (rate: number | null) => (rate === null ? "–" : `${rate}%`);

export function AnalyticsView() {
  const dashboard = useDashboard();
  // Started here so it runs in parallel with the dashboard instead of after it.
  const streaks = useAnalyticsStreaks();

  if (dashboard.isPending) return <AnalyticsSkeleton />;

  if (dashboard.isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <QueryError
          message="Couldn’t load analytics."
          onRetry={() => void dashboard.refetch()}
        />
      </div>
    );
  }

  return <AnalyticsContent today={dashboard.data.date} streaks={streaks} />;
}

type AnalyticsContentProps = { today: string; streaks: UseQueryResult<AnalyticsStreaks> };

function AnalyticsContent({ today, streaks }: AnalyticsContentProps) {
  const heatmap = useHeatmap(getRange(today));

  const days = useMemo(
    () => (heatmap.data ? buildDays(today, heatmap.data) : null),
    [heatmap.data, today],
  );

  const bestStreak = streaks.data?.bestCurrentStreak;
  const topHabit =
    streaks.data && bestStreak
      ? [...streaks.data.habits].sort((a, b) => b.currentStreak - a.currentStreak)[0]
      : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader title="Analytics" description="The full picture of your consistency." />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard
          variant="analytics"
          label="Last 7 days"
          value={days ? formatRate(completionRate(days, 7)) : "–"}
          icon={TrendingUp}
          tint="text-primary"
        />
        <StatCard
          variant="analytics"
          label="Last 30 days"
          value={days ? formatRate(completionRate(days, 30)) : "–"}
          icon={Calendar}
          tint="text-success"
        />
        <StatCard
          variant="analytics"
          label="Top streak"
          value={bestStreak === undefined ? "–" : String(bestStreak)}
          icon={Flame}
          tint="text-warning"
          sub={topHabit?.name}
        />
      </div>

      <div className="mt-10">
        {days ? (
          <Heatmap days={days} />
        ) : heatmap.isError ? (
          <QueryError
            message="Couldn’t load your history."
            onRetry={() => void heatmap.refetch()}
          />
        ) : (
          <Skeleton className="h-56 rounded-2xl" />
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {days ? (
          <WeekdaySection days={days} />
        ) : heatmap.isError ? null : (
          <Skeleton className="h-96 rounded-2xl" />
        )}

        {streaks.data ? (
          <StreakLeaderboard habits={streaks.data.habits} />
        ) : streaks.isError ? (
          <QueryError
            message="Couldn’t load streaks."
            onRetry={() => void streaks.refetch()}
          />
        ) : (
          <Skeleton className="h-96 rounded-2xl" />
        )}
      </div>
    </div>
  );
}
