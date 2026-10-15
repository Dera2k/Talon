import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitSchedule } from './entities/habit-schedule.entity';
import { SchedulesService } from './schedules.service';

@Module({
  imports: [TypeOrmModule.forFeature([HabitSchedule])],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
