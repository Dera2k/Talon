"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/endpoints/notifications";
import { queryKeys } from "@/lib/api/query-keys";
import type { NotificationListQuery } from "@/lib/api/types";

const UNREAD_POLL_MS = 30_000;

export function useNotifications(query: NotificationListQuery = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.notifications.list(query),
    queryFn: () => notificationsApi.list(query),
    enabled,
  });
}

// No push channel exists, so the bell badge polls. Polling pauses while the tab is hidden.
export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: notificationsApi.unreadCount,
    refetchInterval: UNREAD_POLL_MS,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
}
