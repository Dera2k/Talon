import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  name: process.env.DATABASE_NAME ?? 'talon',
  username: process.env.DATABASE_USER ?? 'talon',
  password: process.env.DATABASE_PASSWORD ?? '',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
}));