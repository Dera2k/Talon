import { HabitColor } from '@common/enums/habit-color.enum';
import { HabitFrequency } from '@common/enums/habit-frequency.enum';
import { Habit } from '../entities/habit.entity';

export class HabitResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  color!: HabitColor;
  frequency!: HabitFrequency;
  reminderTime!: string | null;
  archivedAt!: Date | null;
  createdAt!: Date;
  weekdays!: number[];

  static from(habit: Habit): HabitResponseDto {
    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      color: habit.color,
      frequency: habit.frequency,
      reminderTime: habit.reminderTime,
      archivedAt: habit.archivedAt,
      createdAt: habit.createdAt,
      weekdays: habit.schedule.daysOfWeek,
    };
  }
}
