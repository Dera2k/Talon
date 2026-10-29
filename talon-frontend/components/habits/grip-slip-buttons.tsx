"use client";

import { Check, SkipForward } from "lucide-react";
import { TalonMark } from "@/components/brand/talon-mark";
import { Button } from "@/components/ui/button";
import { useLogCompletion } from "@/hooks/queries/use-completions";
import { toastApiError } from "@/lib/api/toast-error";
import type { DashboardHabit } from "@/lib/api/types";

type GripSlipButtonsProps = {
  habitId: string;
  habitName: string;
  status: DashboardHabit["status"];
};

export function GripSlipButtons({ habitId, habitName, status }: GripSlipButtonsProps) {
  const log = useLogCompletion();

  const submit = (next: "completed" | "skipped") =>
    log.mutate({ habitId, status: next }, { onError: toastApiError });

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        aria-label={`Slip ${habitName}`}
        disabled={log.isPending || status === "skipped"}
        onClick={() => submit("skipped")}
      >
        <SkipForward className="mr-1.5 h-3.5 w-3.5" /> Slip
      </Button>
      <Button
        size="sm"
        aria-label={`Grip ${habitName}`}
        disabled={log.isPending || status === "completed"}
        onClick={() => submit("completed")}
      >
        <TalonMark className="mr-1.5 h-3.5 w-3.5" /> Grip
      </Button>
      {status === "completed" && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary">
          <Check className="h-3.5 w-3.5" /> Gripped
        </span>
      )}
    </div>
  );
}
