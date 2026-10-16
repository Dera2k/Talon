import { CompletionStatus } from '@common/enums/completion-status.enum';
import { isDueOn, shiftDateKey } from './date.util';

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
}

export function calculateStreaks(
  daysOfWeek: number[],
  statusByDate: ReadonlyMap<string, CompletionStatus>,
  today: string,
): StreakResult {
  const completedDates = [...statusByDate]
    .filter(([, status]) => status === CompletionStatus.COMPLETED)
    .map(([date]) => date)
    .sort();

  if (!completedDates.length) {
    return { currentStreak: 0, longestStreak: 0, lastCompletedDate: null };
  }

  let run = 0;
  let longest = 0;

  for (
    let date = completedDates[0];
    date <= today;
    date = shiftDateKey(date, 1)
  ) {
    if (!isDueOn(daysOfWeek, date)) continue;

    const status = statusByDate.get(date);
    if (status === CompletionStatus.COMPLETED) {
      run += 1;
      longest = Math.max(longest, run);
    } else if (status === undefined && date === today) {
      continue;
    } else {
      run = 0;
    }
  }

  return {
    currentStreak: run,
    longestStreak: longest,
    lastCompletedDate: completedDates[completedDates.length - 1],
  };
}
