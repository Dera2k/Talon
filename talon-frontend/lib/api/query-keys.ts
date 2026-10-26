import type { Query } from "@/lib/api/client";

export const queryKeys = {
  me: ["me"] as const,
  settings: ["settings"] as const,
  habits: {
    all: ["habits"] as const,
    list: (query: Query) => ["habits", "list", query] as const,
    detail: (id: string) => ["habits", "detail", id] as const,
  },
  completions: {
    all: ["completions"] as const,
    history: (query: Query) => ["completions", "history", query] as const,
  },
  streaks: {
    all: ["streaks"] as const,
    habit: (habitId: string) => ["streaks", habitId] as const,
  },
  dashboard: { today: ["dashboard", "today"] as const },
  analytics: {
    all: ["analytics"] as const,
    heatmap: (query: Query) => ["analytics", "heatmap", query] as const,
    stats: (query: Query) => ["analytics", "stats", query] as const,
    streaks: ["analytics", "streaks"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (query: Query) => ["notifications", "list", query] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },
};
