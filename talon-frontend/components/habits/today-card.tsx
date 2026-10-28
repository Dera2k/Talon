"use client";

import { Check, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLogCompletion, useUndoCompletion } from "@/hooks/queries/use-completions";
import { useDashboard } from "@/hooks/queries/use-dashboard";
import { toastApiError } from "@/lib/api/toast-error";
import { formatDate } from "@/lib/format";

export function TodayCard({ habitId }: { habitId: string }) {
  const dashboard = useDashboard();
  const log = useLogCompletion();
  const undo = useUndoCompletion();

  if (!dashboard.data) return null;

  const { date, habits } = dashboard.data;
  const entry = habits.find((habit) => habit.id === habitId);
  const busy = log.isPending || undo.isPending;

  const complete = () =>
    log.mutate(
      { habitId, status: "completed" },
      { onSuccess: () => toast.success("Nice."), onError: toastApiError },
    );
  const skip = () => log.mutate({ habitId, status: "skipped" }, { onError: toastApiError });
  const reset = () => undo.mutate({ habitId, date }, { onError: toastApiError });

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card/50 p-5">
      <div>
        <p className="font-display text-lg font-semibold">Today</p>
        <p className="text-sm text-muted-foreground">{formatDate(date, "EEEE, MMMM d")}</p>
      </div>

      {!entry ? (
        <p className="text-sm text-muted-foreground">Not scheduled today</p>
      ) : entry.status === "completed" ? (
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1.5 text-sm font-medium text-success">
            <Check className="h-4 w-4" /> Done
          </div>
          <Button variant="ghost" size="sm" disabled={busy} onClick={reset}>
            Undo
          </Button>
        </div>
      ) : entry.status === "skipped" ? (
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground">
            <SkipForward className="h-4 w-4" /> Skipped
          </div>
          <Button size="sm" disabled={busy} onClick={complete}>
            <Check className="mr-1 h-4 w-4" /> Complete
          </Button>
          <Button variant="ghost" size="sm" disabled={busy} onClick={reset}>
            Undo
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button variant="outline" disabled={busy} onClick={skip}>
            Skip
          </Button>
          <Button disabled={busy} onClick={complete}>
            <Check className="mr-1 h-4 w-4" /> Complete
          </Button>
        </div>
      )}
    </div>
  );
}
