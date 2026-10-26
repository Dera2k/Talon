"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/endpoints/analytics";
import { queryKeys } from "@/lib/api/query-keys";
import type { DateRange, StatsInterval } from "@/lib/api/types";

export function useHeatmap(range: DateRange) {
  return useQuery({
    queryKey: queryKeys.analytics.heatmap(range),
    queryFn: () => analyticsApi.heatmap(range),
  });
}

export function useAnalyticsStats(range: DateRange, interval: StatsInterval) {
  return useQuery({
    queryKey: queryKeys.analytics.stats({ ...range, interval }),
    queryFn: () => analyticsApi.stats(range, interval),
  });
}

export function useAnalyticsStreaks() {
  return useQuery({
    queryKey: queryKeys.analytics.streaks,
    queryFn: analyticsApi.streaks,
  });
}
