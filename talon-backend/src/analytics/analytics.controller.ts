import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AuthenticatedUser } from '@common/interfaces/authenticated-user.interface';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRangeDto, StatsQueryDto } from './dto/analytics-query.dto';
import {
  DailyStatsDto,
  PeriodStatsDto,
  StreakStatsDto,
} from './dto/analytics-response.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('heatmap')
  heatmap(
    @CurrentUser() user: AuthenticatedUser,
    @Query() range: AnalyticsRangeDto,
  ): Promise<DailyStatsDto[]> {
    return this.analytics.getHeatmap(user.id, range);
  }

  @Get('stats')
  stats(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: StatsQueryDto,
  ): Promise<PeriodStatsDto[]> {
    return this.analytics.getStats(user.id, query, query.interval);
  }

  @Get('streaks')
  streakStats(@CurrentUser() user: AuthenticatedUser): Promise<StreakStatsDto> {
    return this.analytics.getStreakStats(user.id);
  }
}
