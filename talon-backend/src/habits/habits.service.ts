import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from '@common/exceptions/app.exception';
import { CreateHabitDto } from './dto/create-habit.dto';
import { HabitQueryDto } from './dto/habit-query.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { Habit } from './entities/habit.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit) private readonly habits: Repository<Habit>,
  ) {}

  create(userId: string, dto: CreateHabitDto): Promise<Habit> {
    return this.habits.save(this.habits.create({ ...dto, userId }));
  }

  async list(userId: string, query: HabitQueryDto) {
    const { page, limit, archived } = query;
    const [items, total] = await this.habits.findAndCount({
      where: { userId, archivedAt: archived ? Not(IsNull()) : IsNull() },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOwned(userId: string, id: string): Promise<Habit> {
    const habit = await this.habits.findOneBy({ id, userId });
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
    return this.habits.save(Object.assign(habit, dto));
  }

  async archive(userId: string, id: string): Promise<void> {
    const habit = await this.getOwned(userId, id);
    if (!habit.archivedAt) {
      await this.habits.update(habit.id, { archivedAt: new Date() });
    }
  }
}
