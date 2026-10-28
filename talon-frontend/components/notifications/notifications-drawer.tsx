"use client";

import { Bell } from "lucide-react";
import { useMemo } from "react";
import { NotificationItem } from "@/components/notifications/notification-item";
import { QueryError } from "@/components/shared/query-error";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/queries/use-dashboard";
import {
  useMarkAllRead,
  useNotifications,
  useUnreadCount,
} from "@/hooks/queries/use-notifications";
import { toastApiError } from "@/lib/api/toast-error";

const PAGE_LIMIT = 30;
const MAX_BADGE = 99;

function NotificationList() {
  const notifications = useNotifications({ limit: PAGE_LIMIT });
  const dashboard = useDashboard();

  const habitsById = useMemo(
    () => new Map((dashboard.data?.habits ?? []).map((habit) => [habit.id, habit])),
    [dashboard.data],
  );

  if (notifications.isPending || dashboard.isPending) {
    return (
      <div className="space-y-4 p-5" aria-busy="true">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (notifications.isError) {
    return (
      <div className="p-5">
        <QueryError
          message="Couldn’t load reminders."
          onRetry={() => void notifications.refetch()}
        />
      </div>
    );
  }

  const items = [...notifications.data.items].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  if (items.length === 0) {
    return <p className="p-10 text-center text-sm text-muted-foreground">You’re all caught up.</p>;
  }

  return (
    <ul className="divide-y divide-border overflow-y-auto">
      {items.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          habit={notification.habitId ? habitsById.get(notification.habitId) : undefined}
        />
      ))}
    </ul>
  );
}

export function NotificationsDrawer() {
  const unread = useUnreadCount();
  const markAllRead = useMarkAllRead();
  const count = unread.data?.count ?? 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={count > 0 ? `Reminders, ${count} unread` : "Reminders"}
        >
          <Bell className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {count > MAX_BADGE ? `${MAX_BADGE}+` : count}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b border-border/60 py-4 pl-5 pr-12">
          <SheetTitle className="font-display">Reminders</SheetTitle>
          <SheetDescription className="sr-only">Your habit reminders and milestones.</SheetDescription>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            disabled={count === 0 || markAllRead.isPending}
            onClick={() => markAllRead.mutate(undefined, { onError: toastApiError })}
          >
            Mark all read
          </Button>
        </SheetHeader>
        <NotificationList />
      </SheetContent>
    </Sheet>
  );
}
