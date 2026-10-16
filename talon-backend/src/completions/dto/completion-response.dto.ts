import { CompletionStatus } from '@common/enums/completion-status.enum';
import { HabitCompletion } from '../entities/habit-completion.entity';

export class CompletionResponseDto {
  id!: string;
  habitId!: string;
  date!: string;
  status!: CompletionStatus;
  createdAt!: Date;

  static from(completion: HabitCompletion): CompletionResponseDto {
    return {
      id: completion.id,
      habitId: completion.habitId,
      date: completion.date,
      status: completion.status,
      createdAt: completion.createdAt,
    };
  }
}
