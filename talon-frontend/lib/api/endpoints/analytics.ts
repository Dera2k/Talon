import { api } from "@/lib/api/client";
import type {
  AnalyticsStreaks,
  DateRange,
  Heatmap,
} from "@/lib/api/types";

export const analyticsApi = {
  heatmap: (range: DateRange) => api.get<Heatmap>("/analytics/heatmap", range),
  streaks: () => api.get<AnalyticsStreaks>("/analytics/streaks"),
};
