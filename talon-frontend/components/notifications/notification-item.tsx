"use client";

import { Bell, Check, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogCompletion } from "@/hooks/queries/use-completions";
import { useMarkRead } from "@/hooks/queries/use-notifications";
import { toastApiError } from "@/lib/api/toast-error";
import type { DashboardHabit, Notification } from "@/lib/api/types";
import { formatRelative } from "@/lib/format";
import { getHabitColor } from "@/lib/habit-colors";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type NotificationItemProps = {
  notification: Notification;
  habit?: DashboardHabit;
};

export function NotificationItem({ notification, habit }: NotificationItemProps) {
  const log = useLogCompletion();
  const markRead = useMarkRead();

  const unread = notification.status === "unread";
  const milestone = notification.type === "milestone";
  const color = habit ? getHabitColor(habit.color) : undefined;
  const Icon = habit ? getIcon(habit.icon) : milestone ? Trophy : Bell;

  function handleDone() {
    log.mutate(
      { habitId: notification.habitId as string, status: "completed" },
      {
        onSuccess: () => markRead.mutate([notification.id], { onError: toastApiError }),
        onError: toastApiError,
      },
    );
  }

  function handleMarkRead() {
    markRead.mutate([notification.id], { onError: toastApiError });
  }

  let action = null;
  if (habit?.status === "completed") {
    action = (
      <span
        role="img"
        aria-label="Already gripped"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary"
      >
        <Check className="h-4 w-4" />
      </span>
    );
  } else if (habit?.status === null && !milestone) {
    action = (
      <Button size="sm" disabled={log.isPending || markRead.isPending} onClick={handleDone}>
        Done
      </Button>
    );
  } else if (unread) {
    action = (
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        disabled={markRead.isPending}
        onClick={handleMarkRead}
      >
        Mark read
      </Button>
    );
  }

  return (
    <li className={cn("flex items-start gap-3 px-5 py-4", !unread && "opacity-60")}>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          !habit && (milestone ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"),
        )}
        style={color ? { backgroundColor: `${color}22`, color } : undefined}
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{notification.title}</p>
          {unread && <span aria-label="Unread" className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{notification.message}</p>
        <p className="mt-1 text-xs text-muted-foreground">{formatRelative(notification.createdAt)}</p>
      </div>

      {action && <div className="shrink-0 self-center">{action}</div>}
    </li>
  );
}
