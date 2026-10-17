import { format, formatDistanceToNow, parseISO } from "date-fns";
import { WEEKDAYS } from "@/lib/constants";

export function formatDate(date: string, pattern: string): string {
  return format(parseISO(date), pattern);
}

export function formatRelative(timestamp: string): string {
  return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
}

export function formatSchedule(frequency: "daily" | "weekly", weekdays: number[]): string {
  if (frequency === "daily") return "Daily";
  const days = WEEKDAYS.filter((d) => weekdays.includes(d.value)).map((d) => d.label);
  return `Weekly · ${days.join(", ")}`;
}
