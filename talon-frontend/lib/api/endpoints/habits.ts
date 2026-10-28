import { api } from "@/lib/api/client";
import type {
  CreateHabitInput,
  Habit,
  HabitListQuery,
  Paginated,
  UpdateHabitInput,
} from "@/lib/api/types";

export const habitsApi = {
  list: (query: HabitListQuery = {}) => api.get<Paginated<Habit>>("/habits", query),
  get: (id: string) => api.get<Habit>(`/habits/${id}`),
  create: (input: CreateHabitInput) => api.post<Habit>("/habits", input),
  update: (id: string, input: UpdateHabitInput) => api.patch<Habit>(`/habits/${id}`, input),
  archive: (id: string) => api.delete<void>(`/habits/${id}`),
  restore: (id: string) => api.post<Habit>(`/habits/${id}/restore`),
};
