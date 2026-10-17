import { CompletionStatus } from '@common/enums/completion-status.enum';
import { calculateStreaks } from './streak.util';

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const TODAY = '2026-10-16'; // Friday

const statuses = (entries: [string, CompletionStatus][]) => new Map(entries);
const { COMPLETED, SKIPPED } = CompletionStatus;

describe('calculateStreaks', () => {
  it('returns zeros when nothing was completed', () => {
    expect(calculateStreaks(ALL_DAYS, new Map(), TODAY)).toEqual({
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
    });
  });

  it('counts consecutive completed days through today', () => {
    const result = calculateStreaks(
      ALL_DAYS,
      statuses([
        ['2026-10-14', COMPLETED],
        ['2026-10-15', COMPLETED],
        [TODAY, COMPLETED],
      ]),
      TODAY,
    );
    expect(result).toMatchObject({
      currentStreak: 3,
      longestStreak: 3,
      lastCompletedDate: TODAY,
    });
  });

  it('does not break the streak while today is still pending', () => {
    const result = calculateStreaks(
      ALL_DAYS,
      statuses([
        ['2026-10-14', COMPLETED],
        ['2026-10-15', COMPLETED],
      ]),
      TODAY,
    );
    expect(result.currentStreak).toBe(2);
  });

  it('breaks the streak on a skipped day', () => {
    const result = calculateStreaks(
      ALL_DAYS,
      statuses([
        ['2026-10-14', COMPLETED],
        ['2026-10-15', SKIPPED],
        [TODAY, COMPLETED],
      ]),
      TODAY,
    );
    expect(result).toMatchObject({ currentStreak: 1, longestStreak: 1 });
  });

  it('breaks the streak on a missed due day and keeps the longest run', () => {
    const result = calculateStreaks(
      ALL_DAYS,
      statuses([
        ['2026-10-12', COMPLETED],
        ['2026-10-13', COMPLETED],
        [TODAY, COMPLETED],
      ]),
      TODAY,
    );
    expect(result).toMatchObject({ currentStreak: 1, longestStreak: 2 });
  });

  it('ignores days the habit is not scheduled', () => {
    // Mon/Wed/Fri: 12th, 14th, 16th
    const result = calculateStreaks(
      [1, 3, 5],
      statuses([
        ['2026-10-12', COMPLETED],
        ['2026-10-14', COMPLETED],
        [TODAY, COMPLETED],
      ]),
      TODAY,
    );
    expect(result.currentStreak).toBe(3);
  });
});
