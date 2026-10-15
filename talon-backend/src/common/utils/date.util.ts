// dateKey is "YYYY-MM-DD" from getLocalDateKey; returns 0 (Sunday) to 6 (Saturday)
export function getWeekday(dateKey: string): number {
  return new Date(`${dateKey}T00:00:00Z`).getUTCDay();
}

export function isDueOn(daysOfWeek: number[], dateKey: string): boolean {
  return daysOfWeek.includes(getWeekday(dateKey));
}
