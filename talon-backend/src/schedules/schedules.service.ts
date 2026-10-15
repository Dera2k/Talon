import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ErrorCode } from '@common/enums/error-code.enum';
import { HabitFrequency } from '@common/enums/habit-frequency.enum';
import { AppException } from '@common/exceptions/app.exception';
import { HabitSchedule } from './entities/habit-schedule.entity';

const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(HabitSchedule)
    private readonly schedules: Repository<HabitSchedule>,
  ) {}

  resolveDays(frequency: HabitFrequency, weekdays?: number[]): number[] {
    if (frequency === HabitFrequency.DAILY) return [...ALL_DAYS];

    if (!weekdays?.length) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        ErrorCode.BUSINESS_LOGIC_ERROR,
        'weekdays is required unless the habit is daily',
      );
    }
    return [...new Set(weekdays)].sort((a, b) => a - b);
  }

  create(
    habitId: string,
    daysOfWeek: number[],
    manager: EntityManager = this.schedules.manager,
  ): Promise<HabitSchedule> {
    return manager.save(manager.create(HabitSchedule, { habitId, daysOfWeek }));
  }

  async replace(
    habitId: string,
    daysOfWeek: number[],
    manager: EntityManager = this.schedules.manager,
  ): Promise<HabitSchedule> {
    await manager.update(HabitSchedule, { habitId }, { daysOfWeek });
    return manager.findOneByOrFail(HabitSchedule, { habitId });
  }
}
