import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CompletionStatus } from '@common/enums/completion-status.enum';
import { calculateStreaks } from '@common/utils/streak.util';
import { HabitCompletion } from '@completions/entities/habit-completion.entity';
import { Habit } from '@habits/entities/habit.entity';
import { HabitsService } from '@habits/habits.service';
import { UsersService } from '@users/users.service';
import { Streak } from './entities/streak.entity';

type HabitWithSchedule = Pick<Habit, 'id' | 'userId' | 'schedule'>;

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(Streak) private readonly streaks: Repository<Streak>,
    private readonly habits: HabitsService,
    private readonly users: UsersService,
  ) {}

  async recalculate(
    manager: EntityManager,
    habit: HabitWithSchedule,
    today: string,
  ): Promise<Streak> {
    const rows = (await manager.find(HabitCompletion, {
      where: { habitId: habit.id },
      select: { date: true, status: true },
    })) as { date: string; status: CompletionStatus }[];
    const statusByDate = new Map(rows.map((row) => [row.date, row.status]));
    const result = calculateStreaks(
      habit.schedule.daysOfWeek,
      statusByDate,
      today,
    );

    await manager.upsert(
      Streak,
      {
        habitId: habit.id,
        userId: habit.userId,
        ...result,
        calculatedOn: today,
      },
      ['habitId'],
    );
    return manager.findOneByOrFail(Streak, { habitId: habit.id });
  }

  async getForHabit(userId: string, habitId: string): Promise<Streak> {
    const habit = await this.habits.getOwned(userId, habitId);
    const today = await this.users.getTodayKey(userId);
    const existing: Streak | null = await this.streaks.findOneBy({ habitId });
    return this.refreshIfStale(habit, existing, today);
  }

  async listForUser(userId: string): Promise<Streak[]> {
    const today = await this.users.getTodayKey(userId);
    const habits: Habit[] = await this.habits.findAllActive(userId);
    return this.refreshAll(userId, habits, today);
  }

  async refreshAll(
    userId: string,
    habits: HabitWithSchedule[],
    today: string,
  ): Promise<Streak[]> {
    const existing: Streak[] = await this.streaks.findBy({ userId });
    const byHabit = new Map(existing.map((streak) => [streak.habitId, streak]));

    const result: Streak[] = [];
    for (const habit of habits) {
      result.push(
        await this.refreshIfStale(habit, byHabit.get(habit.id), today),
      );
    }
    return result;
  }

  private async refreshIfStale(
    habit: HabitWithSchedule,
    existing: Streak | null | undefined,
    today: string,
  ): Promise<Streak> {
    if (existing && existing.calculatedOn === today) return existing;
    return this.recalculate(this.streaks.manager, habit, today);
  }
}
