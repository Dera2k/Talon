import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';

import { configuration } from './config/configuration';
import { validationSchema } from './config/validation.config';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from '@users/users.module';
import { AuthModule } from '@auth/auth.module';
import { MailModule } from '@mail/mail.module';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';

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
        },
        defaultJobOptions: config.getOrThrow('bull.defaultJobOptions'),
      }),
    }),

    CacheModule.register({
      isGlobal: true,
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const throttle = config.getOrThrow<{
          ttl: number;
          limit: number;
        }>('throttle');

        return [{ ttl: throttle.ttl, limit: throttle.limit }];
      },
    }),

    HealthModule,
    UsersModule,
    AuthModule,
    MailModule,
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
