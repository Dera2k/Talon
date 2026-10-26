import { Injectable } from '@nestjs/common';
import { CompletionStatus } from '@common/enums/completion-status.enum';
import { isDueOn } from '@common/utils/date.util';
import { CacheKeys } from '@cache/cache.keys';
import { CacheService } from '@cache/cache.service';
import { CompletionsService } from '@completions/completions.service';
import { HabitsService } from '@habits/habits.service';
import { StreaksService } from '@streaks/streaks.service';
import { UsersService } from '@users/users.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

const DASHBOARD_TTL_MS = 60_000;

@Injectable()
export class DashboardService {
  constructor(
    private readonly habits: HabitsService,
    private readonly completions: CompletionsService,
    private readonly streaks: StreaksService,
    private readonly users: UsersService,
    private readonly cache: CacheService,
  ) {}

  async getToday(userId: string): Promise<DashboardResponseDto> {
    const today = await this.users.getTodayKey(userId);
    const key = CacheKeys.dashboard(userId);

    const cached = await this.cache.get<DashboardResponseDto>(key);
    if (cached?.date === today) return cached;

    const dashboard = await this.build(userId, today);
    await this.cache.set(key, dashboard, DASHBOARD_TTL_MS);
    return dashboard;
  }

  private async build(
    userId: string,
    today: string,
  ): Promise<DashboardResponseDto> {
    const dueHabits = (await this.habits.findAllActive(userId)).filter(
      (habit) => isDueOn(habit.schedule.daysOfWeek, today),
    );

    const [completions, streaks] = await Promise.all([
      this.completions.findByDate(userId, today),
      this.streaks.refreshAll(userId, dueHabits, today),
    ]);
    const statusByHabit = new Map(
      completions.map((c) => [c.habitId, c.status]),
    );
    const streakByHabit = new Map(streaks.map((s) => [s.habitId, s]));

    const habits = dueHabits.map((habit) => ({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      color: habit.color,
      icon: habit.icon,
      frequency: habit.frequency,
      weekdays: habit.schedule?.daysOfWeek ?? [],
      reminderTime: habit.reminderTime,
      status: statusByHabit.get(habit.id) ?? null,
      currentStreak: streakByHabit.get(habit.id)?.currentStreak ?? 0,
      longestStreak: streakByHabit.get(habit.id)?.longestStreak ?? 0,
    }));

    const completed = habits.filter(
      (h) => h.status === CompletionStatus.COMPLETED,
    ).length;
    const skipped = habits.filter(
      (h) => h.status === CompletionStatus.SKIPPED,
    ).length;

    return {
      date: today,
      summary: {
        total: habits.length,
        completed,
        skipped,
        pending: habits.length - completed - skipped,
      },
      habits,
    };
  }
}
