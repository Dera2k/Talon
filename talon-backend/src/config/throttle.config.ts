import { registerAs } from '@nestjs/config';

export const throttleConfig = registerAs('throttle', () => ({
  ttl: 15 * 60 * 1000,
  limit: 100,
}));
