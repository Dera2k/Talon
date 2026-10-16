import { Module } from '@nestjs/common';
import { CompletionsModule } from '@completions/completions.module';
import { HabitsModule } from '@habits/habits.module';
import { StreaksModule } from '@streaks/streaks.module';
import { UsersModule } from '@users/users.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [CompletionsModule, HabitsModule, StreaksModule, UsersModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
