export const WEEKDAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
] as const;

export const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

export const HABIT_LIMITS = { name: 100, description: 500, category: 50 } as const;

export const DEFAULT_REMINDER_TIME = "08:00";

export const PASSWORD_LIMITS = { min: 12, max: 128 } as const;
