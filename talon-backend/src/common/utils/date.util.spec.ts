import {
  daysBetween,
  eachDateKey,
  isDueOn,
  isValidDateKey,
  shiftDateKey,
  startOfWeek,
} from './date.util';

describe('date.util', () => {
  it.each([
    ['2026-10-16', true],
    ['2026-02-31', false],
    ['2026-13-01', false],
    ['2026-1-1', false],
    ['not-a-date', false],
  ])('isValidDateKey(%s) = %s', (value, expected) => {
    expect(isValidDateKey(value)).toBe(expected);
  });

  it('shifts across month and year boundaries', () => {
    expect(shiftDateKey('2026-10-31', 1)).toBe('2026-11-01');
    expect(shiftDateKey('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('isDueOn matches JS weekday numbering (0 = Sunday)', () => {
    expect(isDueOn([5], '2026-10-16')).toBe(true); // Friday
    expect(isDueOn([0], '2026-10-16')).toBe(false);
    expect(isDueOn([0], '2026-10-18')).toBe(true); // Sunday
  });

  it('startOfWeek returns the Monday', () => {
    expect(startOfWeek('2026-10-16')).toBe('2026-10-12');
    expect(startOfWeek('2026-10-18')).toBe('2026-10-12');
    expect(startOfWeek('2026-10-12')).toBe('2026-10-12');
  });

  it('daysBetween and eachDateKey are inclusive-consistent', () => {
    expect(daysBetween('2026-10-01', '2026-10-16')).toBe(15);
    expect(eachDateKey('2026-10-14', '2026-10-16')).toEqual([
      '2026-10-14',
      '2026-10-15',
      '2026-10-16',
    ]);
  });
});
