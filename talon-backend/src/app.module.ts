import { Module, Type, DynamicModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';
import { createKeyv } from '@keyv/redis';
import { SchedulerModule } from '@scheduler/scheduler.module';

import { configuration } from './config/configuration';
import { validationSchema } from './config/validation.config';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from '@users/users.module';
import { AuthModule } from '@auth/auth.module';
import { HabitsModule } from '@habits/habits.module';
import { SettingsModule } from '@settings/settings.module';
import { CompletionsModule } from '@completions/completions.module';
import { StreaksModule } from '@streaks/streaks.module';
import { NotificationsModule } from '@notifications/notifications.module';
import { DashboardModule } from '@dashboard/dashboard.module';
import { AnalyticsModule } from '@analytics/analytics.module';
import { QueueModule } from '@queues/queue.module';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

const isTest = process.env.NODE_ENV === 'test';

const conditionalImports: (Type<unknown> | DynamicModule)[] = isTest
  ? []
  : [ScheduleModule.forRoot(), SchedulerModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validationSchema,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),

    DatabaseModule,
    LoggerModule,

    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.getOrThrow<string>('redis.host'),
          port: config.getOrThrow<number>('redis.port'),
          password: config.get<string>('redis.password'),
          tls: config.get<boolean>('redis.tls') ? {} : undefined,
          keepAlive: 10000,
          retryStrategy: (times: number) => Math.min(times * 50, 2000),
        },
        defaultJobOptions: config.getOrThrow('bull.defaultJobOptions'),
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.getOrThrow<string>('redis.host');
        const port = config.getOrThrow<number>('redis.port');
        const password = config.get<string>('redis.password');
        const tls = config.get<boolean>('redis.tls');
        const auth = password ? `:${encodeURIComponent(password)}@` : '';
        const scheme = tls ? 'rediss' : 'redis';

        return { stores: [createKeyv(`${scheme}://${auth}${host}:${port}`)] };
      },
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const { ttl, limit } = config.getOrThrow<{
          ttl: number;
          limit: number;
        }>('throttle');

        return [{ ttl, limit }];
      },
    }),

    HealthModule,
    UsersModule,
    AuthModule,
    HabitsModule,
    SettingsModule,
    CompletionsModule,
    StreaksModule,
    NotificationsModule,
    DashboardModule,
    AnalyticsModule,
    QueueModule,
    ...conditionalImports,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
