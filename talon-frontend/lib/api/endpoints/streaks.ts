import { api } from "@/lib/api/client";
import type { Streak } from "@/lib/api/types";

export const streaksApi = {
  forHabit: (habitId: string) => api.get<Streak>(`/habits/${habitId}/streak`),
};
