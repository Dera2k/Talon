"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { habitsApi } from "@/lib/api/endpoints/habits";
import { invalidateHabitData } from "@/lib/api/invalidation";
import { queryKeys } from "@/lib/api/query-keys";
import type { HabitListQuery, UpdateHabitInput } from "@/lib/api/types";

export function useHabits(query: HabitListQuery = {}) {
  return useQuery({
    queryKey: queryKeys.habits.list(query),
    queryFn: () => habitsApi.list(query),
    placeholderData: keepPreviousData,
  });
}

export function useHabit(id: string) {
  return useQuery({
    queryKey: queryKeys.habits.detail(id),
    queryFn: () => habitsApi.get(id),
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.create,
    onSuccess: () => invalidateHabitData(queryClient),
  });
}

export function useUpdateHabit(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateHabitInput) => habitsApi.update(id, input),
    onSuccess: () => invalidateHabitData(queryClient),
  });
}

export function useArchiveHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.archive,
    onSuccess: () => invalidateHabitData(queryClient),
  });
}

export function useRestoreHabit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: habitsApi.restore,
    onSuccess: () => invalidateHabitData(queryClient),
  });
}
