"use client";

import { notFound } from "next/navigation";
import { HabitForm } from "@/components/habits/habit-form";
import { QueryError } from "@/components/shared/query-error";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabit } from "@/hooks/queries/use-habits";
import { isApiError } from "@/lib/api/errors";

export function EditHabitView({ id }: { id: string }) {
  const habit = useHabit(id);

  if (habit.isPending) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8" aria-busy="true">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-8 h-24 rounded-2xl" />
        <Skeleton className="mt-6 h-64 rounded-2xl" />
      </div>
    );
  }

  if (habit.isError) {
    if (isApiError(habit.error) && habit.error.status === 404) notFound();
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <QueryError message="Couldn’t load this habit." onRetry={() => void habit.refetch()} />
      </div>
    );
  }

  return <HabitForm habit={habit.data} />;
}
