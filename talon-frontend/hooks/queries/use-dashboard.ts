"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/endpoints/dashboard";
import { queryKeys } from "@/lib/api/query-keys";

export function useDashboard() {
  return useQuery({ queryKey: queryKeys.dashboard.today, queryFn: dashboardApi.today });
}
