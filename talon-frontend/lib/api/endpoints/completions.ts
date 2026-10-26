import { api } from "@/lib/api/client";
import type {
  Completion,
  CompletionHistoryQuery,
  LogCompletionInput,
  Paginated,
} from "@/lib/api/types";

export const completionsApi = {
  log: (habitId: string, input: LogCompletionInput) =>
    api.post<Completion>(`/habits/${habitId}/completions`, input),
  undo: (habitId: string, date: string) =>
    api.delete<void>(`/habits/${habitId}/completions/${date}`),
  history: (query: CompletionHistoryQuery = {}) =>
    api.get<Paginated<Completion>>("/completions", query),
};
