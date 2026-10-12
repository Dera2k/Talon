import {
  Injectable,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { DataSource } from 'typeorm';
import { ErrorCode } from '@common/enums/error-code.enum';

@Injectable()
export class HealthService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor(
    private readonly dataSource: DataSource,
    config: ConfigService,
  ) {
    this.redis = new Redis({
      host: config.getOrThrow<string>('redis.host'),
      port: config.getOrThrow<number>('redis.port'),
      password: config.get<string>('redis.password'),
      lazyConnect: true,
      connectTimeout: 1_000,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    });

    this.redis.on('error', () => undefined);
  }

  app() {
    return {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  async database() {
    return this.check('Database', async () => {
      await this.dataSource.query('SELECT 1');
    });
  }

  async redisHealth() {
    return this.check('Redis', async () => {
      await this.redis.ping();
    });
  }

  async queue() {
    return this.redisHealth();
  }

  async overall() {
    await this.database();
    await this.redisHealth();

    return { status: 'ok' };
  }

  onModuleDestroy(): void {
    this.redis.disconnect();
  }

  private async check(name: string, operation: () => Promise<void>) {
    try {
      await operation();

      return { status: 'ok' };
    } catch {
      throw new ServiceUnavailableException({
        code: ErrorCode.SERVICE_UNAVAILABLE,
        message: `${name} is unavailable`,
      });
    }
  }
}
