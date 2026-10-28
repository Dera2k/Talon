"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/endpoints/analytics";
import { queryKeys } from "@/lib/api/query-keys";
import type { DateRange } from "@/lib/api/types";

export function useHeatmap(range: DateRange) {
  return useQuery({
    queryKey: queryKeys.analytics.heatmap(range),
    queryFn: () => analyticsApi.heatmap(range),
  });
}

export function useAnalyticsStreaks() {
  return useQuery({
    queryKey: queryKeys.analytics.streaks,
    queryFn: analyticsApi.streaks,
  });
}
