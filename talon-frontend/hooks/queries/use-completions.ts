"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { completionsApi } from "@/lib/api/endpoints/completions";
import { invalidateCompletionData } from "@/lib/api/invalidation";
import { queryKeys } from "@/lib/api/query-keys";
import type { CompletionHistoryQuery, Dashboard, LogCompletionInput } from "@/lib/api/types";

type LogVariables = LogCompletionInput & { habitId: string };

// The backend reports a pending day as `status: null`, so map null -> "pending" for the summary.
function applyCompletion(dashboard: Dashboard, habitId: string, status: LogVariables["status"]): Dashboard {
  const target = dashboard.habits.find((habit) => habit.id === habitId);
  if (!target) return dashboard;
  const previous = (target.status ?? "pending") as "completed" | "skipped" | "pending";
  if (previous === status) return dashboard;

  return {
    ...dashboard,
    summary: {
      ...dashboard.summary,
      [previous]: dashboard.summary[previous] - 1,
      [status]: dashboard.summary[status] + 1,
    },
    habits: dashboard.habits.map((habit) =>
      habit.id === habitId ? { ...habit, status } : habit,
    ),
  };
}

export function useCompletionHistory(query: CompletionHistoryQuery = {}) {
  return useQuery({
    queryKey: queryKeys.completions.history(query),
    queryFn: () => completionsApi.history(query),
  });
}

// Optimistic: the card flips immediately, and rolls back if the server rejects the log.
export function useLogCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, ...input }: LogVariables) => completionsApi.log(habitId, input),
    onMutate: async ({ habitId, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.dashboard.today });
      const previous = queryClient.getQueryData<Dashboard>(queryKeys.dashboard.today);
      if (previous) {
        queryClient.setQueryData<Dashboard>(queryKeys.dashboard.today, applyCompletion(previous, habitId, status));
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.dashboard.today, context.previous);
    },
    onSettled: () => {
      void invalidateCompletionData(queryClient);
    },
  });
}

export function useUndoCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ habitId, date }: { habitId: string; date: string }) =>
      completionsApi.undo(habitId, date),
    onSuccess: () => invalidateCompletionData(queryClient),
  });
}
