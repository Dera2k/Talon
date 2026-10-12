import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const environment = process.env.NODE_ENV ?? 'development';
dotenv.config({ path: `.env.${environment}` });
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'talon',
  password: process.env.DATABASE_PASSWORD ?? '',
  database: process.env.DATABASE_NAME ?? 'talon',
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: environment === 'development',
  logging: environment === 'development',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});