import { api } from "@/lib/api/client";
import type { Streak, StreakList } from "@/lib/api/types";

export const streaksApi = {
  list: () => api.get<StreakList>("/streaks"),
  forHabit: (habitId: string) => api.get<Streak>(`/habits/${habitId}/streak`),
};
