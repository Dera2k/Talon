import { registerAs } from '@nestjs/config';

export const bullConfig = registerAs('bull', () => ({
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
}));