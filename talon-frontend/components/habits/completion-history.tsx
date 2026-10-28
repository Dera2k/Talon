"use client";

import { Check, SkipForward } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { QueryError } from "@/components/shared/query-error";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabitHistory } from "@/hooks/queries/use-completions";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CompletionHistory({ habitId }: { habitId: string }) {
  const history = useHabitHistory(habitId);

  let body;
  if (history.isPending) {
    body = <Skeleton className="h-40 rounded-2xl" />;
  } else if (history.isError) {
    body = (
      <QueryError message="Couldn’t load history." onRetry={() => void history.refetch()} />
    );
  } else if (history.data.items.length === 0) {
    body = <EmptyState className="rounded-xl p-8">No completions yet.</EmptyState>;
  } else {
    const items = [...history.data.items].sort((a, b) => b.date.localeCompare(a.date));
    body = (
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border bg-card">
        {items.map((item) => {
          const completed = item.status === "completed";
          return (
            <li key={item.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    completed ? "bg-success/15 text-success" : "bg-muted text-muted-foreground",
                  )}
                >
                  {completed ? <Check className="h-4 w-4" /> : <SkipForward className="h-4 w-4" />}
                </div>
                <p className="text-sm font-medium">{formatDate(item.date, "EEE, MMM d")}</p>
              </div>
              <p className="text-xs text-muted-foreground">{completed ? "Done" : "Skipped"}</p>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section className="mt-10">
      <h3 className="mb-4 font-display text-xl font-semibold">History</h3>
      {body}
    </section>
  );
}
