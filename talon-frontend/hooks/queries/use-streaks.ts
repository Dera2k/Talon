"use client";

import { useQuery } from "@tanstack/react-query";
import { streaksApi } from "@/lib/api/endpoints/streaks";
import { queryKeys } from "@/lib/api/query-keys";

export function useStreaks() {
  return useQuery({ queryKey: queryKeys.streaks.all, queryFn: streaksApi.list });
}

export function useHabitStreak(habitId: string) {
  return useQuery({
    queryKey: queryKeys.streaks.habit(habitId),
    queryFn: () => streaksApi.forHabit(habitId),
  });
}
