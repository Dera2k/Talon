import { CompletionStatus } from '@common/enums/completion-status.enum';
import { HabitColor } from '@common/enums/habit-color.enum';
import { HabitFrequency } from '@common/enums/habit-frequency.enum';

export class DashboardHabitDto {
  id!: string;
  name!: string;
  description!: string | null;
  color!: HabitColor;
  icon!: string;
  frequency!: HabitFrequency;
  weekdays!: number[];
  reminderTime!: string | null;
  status!: CompletionStatus | null;
  currentStreak!: number;
  longestStreak!: number;
}

export class DashboardSummaryDto {
  total!: number;
  completed!: number;
  skipped!: number;
  pending!: number;
}

export class DashboardResponseDto {
  date!: string;
  summary!: DashboardSummaryDto;
  habits!: DashboardHabitDto[];
}
