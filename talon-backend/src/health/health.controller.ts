import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { SkipResponseWrapper } from '@common/decorators/skip-response-wrapper.decorator';

@SkipResponseWrapper()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  overall() {
    return this.healthService.overall();
  }

  @Get('app')
  app() {
    return this.healthService.app();
  }

  @Get('database')
  database() {
    return this.healthService.database();
  }

  @Get('redis')
  redis() {
    return this.healthService.redisHealth();
  }

  @Get('queue')
  queue() {
    return this.healthService.queue();
  }
}
