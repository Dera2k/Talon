import { CompletionStatus } from '@common/enums/completion-status.enum';
import { HabitColor } from '@common/enums/habit-color.enum';

export class DashboardHabitDto {
  id!: string;
  name!: string;
  color!: HabitColor;
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
