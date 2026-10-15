import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';
import { Habit } from './entities/habit.entity';
import { SchedulesModule } from '@schedules/schedules.module';

@Module({
  imports: [TypeOrmModule.forFeature([Habit]), SchedulesModule],
  controllers: [HabitsController],
  providers: [HabitsService],
  exports: [HabitsService],
})
export class HabitsModule {}
