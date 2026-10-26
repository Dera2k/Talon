"use client";

import { Check, SkipForward } from "lucide-react";
import { TalonMark } from "@/components/brand/talon-mark";
import { Button } from "@/components/ui/button";
import { useLogCompletion } from "@/hooks/queries/use-completions";
import { toastApiError } from "@/lib/api/toast-error";
import type { DashboardHabit } from "@/lib/api/types";

type GripSlipButtonsProps = {
  habitId: string;
  status: DashboardHabit["status"];
};

export function GripSlipButtons({ habitId, status }: GripSlipButtonsProps) {
  const log = useLogCompletion();

  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary">
        <Check className="h-3.5 w-3.5" /> Gripped
      </span>
    );
  }

  if (status === "skipped") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
        <SkipForward className="h-3.5 w-3.5" /> Slipped
      </span>
    );
  }

  const submit = (next: "completed" | "skipped") =>
    log.mutate({ habitId, status: next }, { onError: toastApiError });

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        disabled={log.isPending}
        onClick={() => submit("skipped")}
      >
        Slip
      </Button>
      <Button size="sm" disabled={log.isPending} onClick={() => submit("completed")}>
        <TalonMark className="mr-1.5 h-3.5 w-3.5" /> Grip
      </Button>
    </div>
  );
}
