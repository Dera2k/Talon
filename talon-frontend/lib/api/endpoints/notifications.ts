import { api } from "@/lib/api/client";
import type {
  Notification,
  NotificationListQuery,
  Paginated,
  UnreadCount,
} from "@/lib/api/types";

export const notificationsApi = {
  list: (query: NotificationListQuery = {}) =>
    api.get<Paginated<Notification>>("/notifications", query),
  unreadCount: () => api.get<UnreadCount>("/notifications/unread-count"),
  markRead: (ids: string[]) => api.post<void>("/notifications/read", { ids }),
  markAllRead: () => api.post<void>("/notifications/read-all"),
};
