import { registerAs } from '@nestjs/config';

export const cacheConfig = registerAs('cache', () => ({
  dashboardTtlMs: 5 * 60 * 1000,
  analyticsTtlMs: 60 * 60 * 1000,
  notificationsTtlMs: 5 * 60 * 1000,
  streaksTtlMs: 5 * 60 * 1000,
}));