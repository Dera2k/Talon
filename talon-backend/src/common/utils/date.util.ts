// dateKey is "YYYY-MM-DD" from getLocalDateKey; returns 0 (Sunday) to 6 (Saturday)
export function getWeekday(dateKey: string): number {
  return new Date(`${dateKey}T00:00:00Z`).getUTCDay();
}

export function isDueOn(daysOfWeek: number[], dateKey: string): boolean {
  return daysOfWeek.includes(getWeekday(dateKey));
}

export function isValidDateKey(dateKey: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return false;
  const date = new Date(`${dateKey}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().startsWith(dateKey)
  );
}

export function shiftDateKey(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  return Math.round(
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
      86_400_000,
  );
}

export function eachDateKey(from: string, to: string): string[] {
  const dates: string[] = [];
  for (let date = from; date <= to; date = shiftDateKey(date, 1)) {
    dates.push(date);
  }
  return dates;
}

export function startOfWeek(dateKey: string): string {
  return shiftDateKey(dateKey, -((getWeekday(dateKey) + 6) % 7));
}
