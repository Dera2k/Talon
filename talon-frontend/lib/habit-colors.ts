export const HABIT_COLORS = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  purple: "#8b5cf6",
  pink: "#ec4899",
  orange: "#f97316",
  indigo: "#4f46e5",
  teal: "#14b8a6",
  gray: "#6b7280",
} as const;

export type HabitColorName = keyof typeof HABIT_COLORS;

export const HABIT_COLOR_NAMES = Object.keys(HABIT_COLORS) as HabitColorName[];

export const DEFAULT_HABIT_COLOR: HabitColorName = "indigo";

export function getHabitColor(name: string): string {
  return Object.hasOwn(HABIT_COLORS, name) ? HABIT_COLORS[name as HabitColorName] : HABIT_COLORS.gray;
}
