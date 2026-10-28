"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CompletionHistory } from "@/components/habits/completion-history";
import { HabitActions } from "@/components/habits/habit-actions";
import { StreakStats } from "@/components/habits/streak-stats";
import { TodayCard } from "@/components/habits/today-card";
import { QueryError } from "@/components/shared/query-error";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabit } from "@/hooks/queries/use-habits";
import { isApiError } from "@/lib/api/errors";
import { getIcon } from "@/lib/icons";
import { getHabitColor } from "@/lib/habit-colors";
import { formatSchedule } from "@/lib/format";

export function HabitDetail({ id }: { id: string }) {
  const query = useHabit(id);

  if (query.isPending) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8" aria-busy="true">
        <Skeleton className="h-16 w-full max-w-md rounded-2xl" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (query.isError) {
    if (isApiError(query.error) && query.error.status === 404) notFound();
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <QueryError message="Couldn’t load this habit." onRetry={() => void query.refetch()} />
      </div>
    );
  }

  const habit = query.data;
  const archived = Boolean(habit.archivedAt);
  const Icon = getIcon(habit.icon);
  const color = getHabitColor(habit.color);

  const meta = [
    formatSchedule(habit.frequency, habit.weekdays),
    habit.reminderTime ? `reminder at ${habit.reminderTime}` : null,
    habit.category,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/app/habits"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {/* eslint-disable-next-line react-hooks/static-components */}
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              {habit.name}
              {archived && (
                <span className="ml-3 rounded-full bg-muted px-2 py-0.5 align-middle text-xs font-normal text-muted-foreground">
                  Archived
                </span>
              )}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {habit.description ?? "No description"}
            </p>
            <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{meta}</p>
          </div>
        </div>
        <HabitActions id={habit.id} archived={archived} />
      </header>

      <StreakStats habitId={habit.id} />
      {!archived && <TodayCard habitId={habit.id} />}
      <CompletionHistory habitId={habit.id} />
    </div>
  );
}
