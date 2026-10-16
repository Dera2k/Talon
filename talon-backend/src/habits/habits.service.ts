import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from '@common/exceptions/app.exception';
import { CreateHabitDto } from './dto/create-habit.dto';
import { HabitQueryDto } from './dto/habit-query.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Habit } from './entities/habit.entity';
import { SchedulesService } from '@schedules/schedules.service';
import { CacheService } from '@cache/cache.service';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit) private readonly habits: Repository<Habit>,
    private readonly schedules: SchedulesService,
    private readonly cache: CacheService,
  ) {}

  create(userId: string, dto: CreateHabitDto): Promise<Habit> {
    const { weekdays, ...fields } = dto;
    const days = this.schedules.resolveDays(dto.frequency, weekdays);

    const habit = this.habits.manager.transaction(async (manager) => {
      const created = await manager.save(
        manager.create(Habit, { ...fields, userId }),
      );
      created.schedule = await this.schedules.create(created.id, days, manager);
      return created;
    });
    return habit.then(async (result) => {
      await this.cache.invalidateDashboard(userId);
      return result;
    });
  }

  async list(userId: string, query: HabitQueryDto) {
    const { page, limit, archived } = query;
    const [items, total] = await this.habits.findAndCount({
      where: { userId, archivedAt: archived ? Not(IsNull()) : IsNull() },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: { schedule: true },
    });

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOwned(userId: string, id: string): Promise<Habit> {
    const habit = await this.habits.findOne({
      where: { id, userId },
      relations: { schedule: true },
    });
    if (!habit) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        'Habit not found',
      );
    }
    return habit;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateHabitDto,
  ): Promise<Habit> {
    const habit = await this.getOwned(userId, id);
    const { weekdays, ...fields } = dto;

    const scheduleChanged =
      dto.frequency !== undefined || weekdays !== undefined;
    const days = scheduleChanged
      ? this.schedules.resolveDays(dto.frequency ?? habit.frequency, weekdays)
      : null;

    const saved = await this.habits.manager.transaction(async (manager) => {
      const result = await manager.save(Object.assign(habit, fields));
      if (days)
        result.schedule = await this.schedules.replace(habit.id, days, manager);
      return result;
    });
    await this.cache.invalidateDashboard(userId);
    return saved;
  }

  async archive(userId: string, id: string): Promise<void> {
    const habit = await this.getOwned(userId, id);
    if (!habit.archivedAt) {
      await this.habits.update(habit.id, { archivedAt: new Date() });
      await this.cache.invalidateDashboard(userId);
    }
  }

  findAllActive(userId: string): Promise<Habit[]> {
    return this.habits.find({
      where: { userId, archivedAt: IsNull() },
      order: { createdAt: 'ASC' },
      relations: { schedule: true },
    });
  }

  findAllForAnalytics(userId: string): Promise<Habit[]> {
    return this.habits.find({
      where: { userId },
      relations: { schedule: true },
    });
  }
}
