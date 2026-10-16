import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from '@common/exceptions/app.exception';
import { isDueOn, isValidDateKey, shiftDateKey } from '@common/utils/date.util';
import { HabitsService } from '@habits/habits.service';
import { StreaksService } from '@streaks/streaks.service';
import { UsersService } from '@users/users.service';
import { CompletionHistoryQueryDto } from './dto/completion-history-query.dto';
import { LogCompletionDto } from './dto/log-completion.dto';
import { HabitCompletion } from './entities/habit-completion.entity';

const MAX_BACKDATE_DAYS = 7;

@Injectable()
export class CompletionsService {
  constructor(
    @InjectRepository(HabitCompletion)
    private readonly completions: Repository<HabitCompletion>,
    private readonly habits: HabitsService,
    private readonly streaks: StreaksService,
    private readonly users: UsersService,
  ) {}

  async log(
    userId: string,
    habitId: string,
    dto: LogCompletionDto,
  ): Promise<HabitCompletion> {
    const habit = await this.habits.getOwned(userId, habitId);
    if (habit.archivedAt) {
      throw this.businessError('Archived habits cannot be logged');
    }

    const today = await this.users.getTodayKey(userId);
    const date = this.resolveDate(today, dto.date);
    if (!isDueOn(habit.schedule.daysOfWeek, date)) {
      throw this.businessError('Habit is not scheduled on this date');
    }

    return this.completions.manager.transaction(async (manager) => {
      await manager.upsert(
        HabitCompletion,
        { habitId, userId, date, status: dto.status },
        ['habitId', 'date'],
      );
      await this.streaks.recalculate(manager, habit, today);
      return manager.findOneByOrFail(HabitCompletion, { habitId, date });
    });
  }

  async undo(userId: string, habitId: string, dateKey: string): Promise<void> {
    const habit = await this.habits.getOwned(userId, habitId);
    const today = await this.users.getTodayKey(userId);
    const date = this.resolveDate(today, dateKey);

    await this.completions.manager.transaction(async (manager) => {
      await manager.delete(HabitCompletion, { habitId, userId, date });
      await this.streaks.recalculate(manager, habit, today);
    });
  }

  async history(userId: string, query: CompletionHistoryQueryDto) {
    const { page, limit, habitId, from, to } = query;

    const [items, total] = await this.completions.findAndCount({
      where: {
        userId,
        ...(habitId && { habitId }),
        ...(from && to
          ? { date: Between(from, to) }
          : from
            ? { date: MoreThanOrEqual(from) }
            : to
              ? { date: LessThanOrEqual(to) }
              : {}),
      },
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  private resolveDate(today: string, requested?: string): string {
    if (!requested) return today;

    const earliest = shiftDateKey(today, -MAX_BACKDATE_DAYS);
    if (
      !isValidDateKey(requested) ||
      requested > today ||
      requested < earliest
    ) {
      throw this.businessError(
        `date must be a valid date within the last ${MAX_BACKDATE_DAYS} days`,
      );
    }
    return requested;
  }

  private businessError(message: string): AppException {
    return new AppException(
      HttpStatus.BAD_REQUEST,
      ErrorCode.BUSINESS_LOGIC_ERROR,
      message,
    );
  }
}
