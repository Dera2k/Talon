import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { seedUsers } from './user.seed';
import { seedHabits } from './habit.seed';
import { seedNotifications } from './notification.seed';

const environment = process.env.NODE_ENV ?? 'development';
dotenv.config({ path: `.env.${environment}` });
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'talon',
  password: process.env.DATABASE_PASSWORD ?? '',
  database: process.env.DATABASE_NAME ?? 'talon',
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: environment === 'development',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});

async function bootstrap(): Promise<void> {
  console.info('🌱 Starting database seed...');

  try {
    await AppDataSource.initialize();
    console.info('✓ Database connected');

    await seedUsers(AppDataSource);
    await seedHabits(AppDataSource);
    await seedNotifications(AppDataSource);

    console.info('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void bootstrap();