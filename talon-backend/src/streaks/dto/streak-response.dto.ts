import { Streak } from '../entities/streak.entity';

export class StreakResponseDto {
  habitId!: string;
  currentStreak!: number;
  longestStreak!: number;
  lastCompletedDate!: string | null;

  static from(streak: Streak): StreakResponseDto {
    return {
      habitId: streak.habitId,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastCompletedDate: streak.lastCompletedDate,
    };
  }
}
