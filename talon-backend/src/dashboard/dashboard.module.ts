import { Module } from '@nestjs/common';
import { AppCacheModule } from '@cache/cache.module';
import { CompletionsModule } from '@completions/completions.module';
import { HabitsModule } from '@habits/habits.module';
import { StreaksModule } from '@streaks/streaks.module';
import { UsersModule } from '@users/users.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    AppCacheModule,
    CompletionsModule,
    HabitsModule,
    StreaksModule,
    UsersModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
