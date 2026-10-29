import type { APIRequestContext, Page } from "@playwright/test";
import { newUser, type TestUser } from "../e2e/helpers";

const TIMEZONE = "America/New_York";
const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

export const HABIT_NAMES = {
  gripped: "Morning workout",
  skipped: "Read 20 pages",
  pending: "Evening walk",
  pendingTwo: "Journal",
  weekly: "Weekly review",
  archived: "Old habit",
} as const;

export type SeededAccount = { user: TestUser; habits: typeof HABIT_NAMES };

type Envelope<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

type HabitSeed = {
  name: string;
  color: string;
  icon: string;
  reminderTime?: string;
  description?: string;
  category?: string;
  frequency?: "daily" | "weekly";
  weekdays?: number[];
};

async function call<T>(
  request: APIRequestContext,
  method: "GET" | "POST" | "DELETE",
  path: string,
  token: string | null,
  data?: unknown,
): Promise<T> {
  const response = await request.fetch(`/api${path}`, {
    method,
    data,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (response.status() === 204) return undefined as T;

  const body = (await response.json()) as Envelope<T>;
  if (!body.success) throw new Error(`${method} ${path} failed: ${body.error.message}`);
  return body.data;
}

function daysBefore(date: string, days: number): string {
  const result = new Date(`${date}T00:00:00Z`);
  result.setUTCDate(result.getUTCDate() - days);
  return result.toISOString().slice(0, 10);
}

async function register(page: Page): Promise<{ user: TestUser; token: string }> {
  const user = newUser();
  const { accessToken } = await call<{ accessToken: string }>(
    page.request,
    "POST",
    "/auth/register",
    null,
    { ...user, timezone: TIMEZONE },
  );
  return { user, token: accessToken };
}

export async function seedEmptyAccount(page: Page): Promise<TestUser> {
  return (await register(page)).user;
}

export async function seedFullAccount(page: Page): Promise<SeededAccount> {
  const { user, token } = await register(page);
  const { request } = page;

  const { date: today } = await call<{ date: string }>(request, "GET", "/dashboard/today", token);

  const create = (habit: HabitSeed) =>
    call<{ id: string }>(request, "POST", "/habits", token, {
      reminderTime: "08:00",
      frequency: "daily",
      weekdays: EVERY_DAY,
      ...habit,
    });
  const log = (habitId: string, status: "completed" | "skipped", date?: string) =>
    call(request, "POST", `/habits/${habitId}/completions`, token, { status, date });

  const gripped = await create({
    name: HABIT_NAMES.gripped,
    color: "green",
    icon: "dumbbell",
    description: "Strength or cardio, 30 minutes.",
    category: "Health",
    reminderTime: "07:00",
  });
  const skipped = await create({
    name: HABIT_NAMES.skipped,
    color: "blue",
    icon: "book",
    description: "Any book counts.",
    category: "Growth",
    reminderTime: "08:30",
  });
  const pending = await create({
    name: HABIT_NAMES.pending,
    color: "orange",
    icon: "target",
    reminderTime: "18:00",
  });
  await create({
    name: HABIT_NAMES.pendingTwo,
    color: "purple",
    icon: "music",
    description: "Five quiet minutes before bed.",
    reminderTime: "21:00",
  });
  await create({
    name: HABIT_NAMES.weekly,
    color: "teal",
    icon: "pencil",
    frequency: "weekly",
    weekdays: [1, 3, 5],
    reminderTime: "09:00",
  });
  const archived = await create({ name: HABIT_NAMES.archived, color: "gray", icon: "target" });
  await call(request, "DELETE", `/habits/${archived.id}`, token);

  await log(gripped.id, "completed");
  await log(skipped.id, "skipped");

  for (let back = 1; back <= 6; back++) {
    await log(gripped.id, "completed", daysBefore(today, back));
  }
  for (const back of [1, 2, 3, 5]) await log(skipped.id, "completed", daysBefore(today, back));
  await log(skipped.id, "skipped", daysBefore(today, 4));
  for (const back of [2, 4, 6]) await log(pending.id, "completed", daysBefore(today, back));

  return { user, habits: HABIT_NAMES };
}
