import { format, getDay, parseISO, subDays } from "date-fns";
import type { Heatmap } from "@/lib/api/types";
import { WEEKDAYS } from "@/lib/constants";

export type DayStat = { date: string; due: number; completed: number; skipped: number };

export const HEATMAP_DAYS = 90;
const WEEKDAY_WINDOW = 30;

const toDateString = (date: Date) => format(date, "yyyy-MM-dd");

export function getRange(today: string) {
  return { from: toDateString(subDays(parseISO(today), HEATMAP_DAYS - 1)), to: today };
}

// One entry per day, oldest first. Days the server omits count as nothing due.
export function buildDays(today: string, heatmap: Heatmap): DayStat[] {
  const byDate = new Map(heatmap.map((day) => [day.date, day]));
  const end = parseISO(today);

  return Array.from({ length: HEATMAP_DAYS }, (_, i) => {
    const date = toDateString(subDays(end, HEATMAP_DAYS - 1 - i));
    const found = byDate.get(date);
    return {
      date,
      due: found?.due ?? 0,
      completed: found?.completed ?? 0,
      skipped: found?.skipped ?? 0,
    };
  });
}

const totals = (days: DayStat[]) => ({
  due: days.reduce((sum, day) => sum + day.due, 0),
  completed: days.reduce((sum, day) => sum + day.completed, 0),
});

// null when nothing was due, so the UI shows "–" instead of a misleading 0%.
export function completionRate(days: DayStat[], window: number): number | null {
  const { due, completed } = totals(days.slice(-window));
  return due ? Math.round((completed / due) * 100) : null;
}

// Weekday values follow the backend: 0 = Sunday. Output is Monday-first.
export function weekdayRates(days: DayStat[]) {
  const recent = days.slice(-WEEKDAY_WINDOW);

  return WEEKDAYS.map(({ value, label }) => {
    const { due, completed } = totals(recent.filter((day) => getDay(parseISO(day.date)) === value));
    return { day: label, due, rate: due ? Math.round((completed / due) * 100) : 0 };
  });
}
