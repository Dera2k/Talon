import type { paths } from "@/lib/api/schema";
import type { HabitColorName } from "@/lib/habit-colors";

type Operation<P extends keyof paths, M extends keyof paths[P]> = paths[P][M];
type JsonContent<T> = T extends { content: { "application/json": infer B } } ? B : never;

type RequestBody<P extends keyof paths, M extends keyof paths[P]> =
  Operation<P, M> extends { requestBody?: infer R } ? JsonContent<NonNullable<R>> : never;

// Swagger emits `default` instead of a status code when @ApiResponse omits one,
// so fall back to it before giving up on the response body.
type ResponseBody<
  P extends keyof paths,
  M extends keyof paths[P],
  S extends number = 200,
> = Operation<P, M> extends { responses: infer R }
  ? S extends keyof R
    ? JsonContent<R[S]>
    : "default" extends keyof R
      ? JsonContent<R["default"]>
      : never
  : never;

type QueryParams<P extends keyof paths, M extends keyof paths[P]> =
  Operation<P, M> extends { parameters: { query: infer Q } } ? Q : never;

type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

// The backend has no PaginatedResponseDto, so the list envelope is hand-written.
// Swagger also cannot express a generic item type, so callers supply it.
export type PageMeta = { page: number; limit: number; total: number; totalPages: number };
export type Paginated<T> = { items: T[]; meta: PageMeta };

// Pagination params are typed as `Object` in the schema (the DTOs use @Type(() => Number)),
// so page/limit are declared by hand everywhere they appear.
export type DateRange = Pick<QueryParams<"/analytics/heatmap", "get">, "from" | "to">;

// Auth
export type RegisterInput = RequestBody<"/auth/register", "post">;
export type LoginInput = RequestBody<"/auth/login", "post">;
export type ForgotPasswordInput = RequestBody<"/auth/forgot-password", "post">;
export type ResetPasswordInput = RequestBody<"/auth/reset-password", "post">;
export type AuthResult = ResponseBody<"/auth/register", "post", 201>;
export type LoginResult = ResponseBody<"/auth/login", "post">;
export type RefreshResult = ResponseBody<"/auth/refresh", "post">;

// Users & settings
export type User = ResponseBody<"/users/me", "get">;
export type UpdateProfileInput = RequestBody<"/users/me", "patch">;
export type Settings = ResponseBody<"/settings", "get">;
export type UpdateSettingsInput = RequestBody<"/settings", "patch">;
export type ChangePasswordInput = RequestBody<"/settings/change-password", "post">;
export type DeleteAccountInput = RequestBody<"/settings/account", "delete">;

// Habits
export type Habit = ResponseBody<"/habits/{id}", "get">;
export type HabitColor = Habit["color"];
export type HabitFrequency = Habit["frequency"];
export type CreateHabitInput = RequestBody<"/habits", "post">;
export type UpdateHabitInput = RequestBody<"/habits/{id}", "patch">;
export type HabitListQuery = { page?: number; limit?: number; archived?: boolean };

// Fails the build if lib/habit-colors.ts drifts from the backend enum.
export const colorsInSync: Equals<HabitColorName, HabitColor> = true;

// Completions & streaks
export type Completion = ResponseBody<"/habits/{habitId}/completions", "post">;
export type LogCompletionInput = RequestBody<"/habits/{habitId}/completions", "post">;
export type CompletionHistoryQuery = {
  habitId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};
export type Streak = ResponseBody<"/habits/{habitId}/streak", "get">;
export type StreakList = ResponseBody<"/streaks", "get">;

// Dashboard & analytics
export type Dashboard = ResponseBody<"/dashboard/today", "get">;
export type DashboardHabit = Dashboard["habits"][number];
export type Heatmap = ResponseBody<"/analytics/heatmap", "get">;
export type AnalyticsStats = ResponseBody<"/analytics/stats", "get">;
export type AnalyticsStreaks = ResponseBody<"/analytics/streaks", "get">;
// "weekday" arrives in Phase 14 with the completion-by-weekday chart.
export type StatsInterval = Exclude<QueryParams<"/analytics/stats", "get">["interval"], "weekday">;

// Notifications
export type Notification = ResponseBody<"/notifications", "get">;
export type NotificationStatus = Notification["status"];
export type NotificationType = Notification["type"];
export type NotificationListQuery = { status?: NotificationStatus; page?: number; limit?: number };
export type UnreadCount = ResponseBody<"/notifications/unread-count", "get">;
