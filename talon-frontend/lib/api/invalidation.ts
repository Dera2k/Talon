import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";

// Anything derived from completions: Perch, history, streaks, analytics.
export function invalidateCompletionData(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.today }),
    queryClient.invalidateQueries({ queryKey: queryKeys.completions.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.streaks.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all }),
  ]);
}

// Habit changes alter due days, archive state and streak inputs, so they touch everything above too.
export function invalidateHabitData(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.habits.all }),
    invalidateCompletionData(queryClient),
  ]);
}
