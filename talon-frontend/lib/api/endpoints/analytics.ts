import { api } from "@/lib/api/client";
import type {
  AnalyticsStats,
  AnalyticsStreaks,
  DateRange,
  Heatmap,
  StatsInterval,
} from "@/lib/api/types";

export const analyticsApi = {
  heatmap: (range: DateRange) => api.get<Heatmap>("/analytics/heatmap", range),
  stats: (range: DateRange, interval: StatsInterval) =>
    api.get<AnalyticsStats>("/analytics/stats", { ...range, interval }),
  streaks: () => api.get<AnalyticsStreaks>("/analytics/streaks"),
};
