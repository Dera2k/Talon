import { generateToken, hashToken } from './crypto.util';
import { durationToMs } from './duration.util';

describe('crypto.util', () => {
  it('generates unique url-safe tokens', () => {
    const a = generateToken();
    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(generateToken()).not.toBe(a);
  });

  it('hashes deterministically and never returns the raw token', () => {
    expect(hashToken('abc')).toBe(hashToken('abc'));
    expect(hashToken('abc')).not.toBe(hashToken('abd'));
    expect(hashToken('abc')).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('durationToMs', () => {
  it.each([
    ['30s', 30_000],
    ['20m', 1_200_000],
    ['2h', 7_200_000],
    ['7d', 604_800_000],
  ])('%s', (value, ms) => expect(durationToMs(value)).toBe(ms));

  it('rejects invalid formats', () => {
    expect(() => durationToMs('7 days')).toThrow();
    expect(() => durationToMs('')).toThrow();
  });
});
