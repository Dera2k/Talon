import { HttpStatus, Injectable } from '@nestjs/common';
import { CompletionStatus } from '@common/enums/completion-status.enum';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from '@common/exceptions/app.exception';
import {
  daysBetween,
  eachDateKey,
  getWeekday,
  isDueOn,
  isValidDateKey,
  startOfWeek,
} from '@common/utils/date.util';
import { getLocalDateKey } from '@common/utils/timezone.util';
import { CompletionsService } from '@completions/completions.service';
import { DailyStatusCount } from '@completions/completions.service';
import { HabitsService } from '@habits/habits.service';
import { Habit } from '@habits/entities/habit.entity';
import { StreaksService } from '@streaks/streaks.service';
import { Streak } from '@streaks/entities/streak.entity';
import { UsersService } from '@users/users.service';
import { AnalyticsRangeDto, StatsInterval } from './dto/analytics-query.dto';
import {
  DailyStatsDto,
  PeriodStatsDto,
  StreakStatsDto,
} from './dto/analytics-response.dto';

const MAX_RANGE_DAYS = 366;

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly habits: HabitsService,
    private readonly completions: CompletionsService,
    private readonly streaks: StreaksService,
    private readonly users: UsersService,
  ) {}

  getHeatmap(
    userId: string,
    range: AnalyticsRangeDto,
  ): Promise<DailyStatsDto[]> {
    return this.buildDailySeries(userId, range);
  }

  async getStats(
    userId: string,
    range: AnalyticsRangeDto,
    interval: StatsInterval,
  ): Promise<PeriodStatsDto[]> {
    const days = await this.buildDailySeries(userId, range);
    const periods = new Map<string, PeriodStatsDto>();
    const WEEKDAY_NAMES = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    for (const day of days) {
      let period: string;
      if (interval === StatsInterval.WEEK) {
        period = startOfWeek(day.date);
      } else if (interval === StatsInterval.WEEKDAY) {
        period = WEEKDAY_NAMES[getWeekday(day.date)];
      } else {
        period = day.date.slice(0, 7);
      }
      const bucket = periods.get(period) ?? {
        period,
        due: 0,
        completed: 0,
        skipped: 0,
        missed: 0,
        completionRate: 0,
      };

      bucket.due += day.due;
      bucket.completed += day.completed;
      bucket.skipped += day.skipped;
      periods.set(period, bucket);
    }

    return [...periods.values()].map((bucket) => ({
      ...bucket,
      missed: Math.max(0, bucket.due - bucket.completed - bucket.skipped),
      completionRate: bucket.due
        ? Math.min(1, Math.round((bucket.completed / bucket.due) * 100) / 100)
        : 0,
    }));
  }

  async getStreakStats(userId: string): Promise<StreakStatsDto> {
    const today: string = await this.users.getTodayKey(userId);
    const habits: Habit[] = await this.habits.findAllActive(userId);
    const streaks: Streak[] = await this.streaks.refreshAll(
      userId,
      habits,
      today,
    );
    const streakByHabit = new Map<string, (typeof streaks)[number]>(
      streaks.map((s) => [s.habitId, s]),
    );

    const items = habits.map((habit) => ({
      habitId: habit.id,
      name: habit.name,
      currentStreak: streakByHabit.get(habit.id)?.currentStreak ?? 0,
      longestStreak: streakByHabit.get(habit.id)?.longestStreak ?? 0,
    }));

    return {
      bestCurrentStreak: Math.max(0, ...items.map((i) => i.currentStreak)),
      longestStreak: Math.max(0, ...items.map((i) => i.longestStreak)),
      habits: items,
    };
  }

  private async buildDailySeries(
    userId: string,
    { from, to }: AnalyticsRangeDto,
  ): Promise<DailyStatsDto[]> {
    this.assertValidRange(from, to);

    const { timezone } = await this.users.getById(userId);
    const today: string = getLocalDateKey(timezone);
    const end: string = to < today ? to : today;
    if (from > end) return [];

    const habits: Habit[] = await this.habits.findAllForAnalytics(userId);
    const counts: DailyStatusCount[] =
      await this.completions.countByDateAndStatus(userId, from, end);

    const lifespans = habits.map((habit) => ({
      daysOfWeek: habit.schedule.daysOfWeek,
      start: getLocalDateKey(timezone, habit.createdAt),
      end: habit.archivedAt
        ? getLocalDateKey(timezone, habit.archivedAt)
        : null,
    }));

    const countsByDate = new Map<
      string,
      { completed: number; skipped: number }
    >();
    for (const { date, status, count } of counts) {
      const entry = countsByDate.get(date) ?? { completed: 0, skipped: 0 };
      if (status === CompletionStatus.COMPLETED) entry.completed += count;
      else entry.skipped += count;
      countsByDate.set(date, entry);
    }

    return eachDateKey(from, end).map((date: string) => ({
      date,
      due: lifespans.filter(
        (h) =>
          date >= h.start &&
          (h.end === null || date < h.end) &&
          isDueOn(h.daysOfWeek, date),
      ).length,
      completed: countsByDate.get(date)?.completed ?? 0,
      skipped: countsByDate.get(date)?.skipped ?? 0,
    }));
  }

  private assertValidRange(from: string, to: string): void {
    if (!isValidDateKey(from) || !isValidDateKey(to) || from > to) {
      throw this.businessError(
        'from and to must be valid dates with from <= to',
      );
    }
    if (daysBetween(from, to) >= MAX_RANGE_DAYS) {
      throw this.businessError(`Range cannot exceed ${MAX_RANGE_DAYS} days`);
    }
  }

  private businessError(message: string): AppException {
    return new AppException(
      HttpStatus.BAD_REQUEST,
      ErrorCode.BUSINESS_LOGIC_ERROR,
      message,
    );
  }
}
