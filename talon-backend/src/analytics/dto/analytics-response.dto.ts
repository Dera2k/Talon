import { HabitColor } from '@common/enums/habit-color.enum';

export class DailyStatsDto {
  date!: string;
  due!: number;
  completed!: number;
  skipped!: number;
}

export class PeriodStatsDto {
  period!: string;
  due!: number;
  completed!: number;
  skipped!: number;
  missed!: number;
  completionRate!: number;
}

export class HabitStreakStatsDto {
  habitId!: string;
  name!: string;
  color!: HabitColor;
  currentStreak!: number;
  longestStreak!: number;
}

export class StreakStatsDto {
  bestCurrentStreak!: number;
  longestStreak!: number;
  habits!: HabitStreakStatsDto[];
}
