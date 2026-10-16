import { IsEnum, IsOptional, Matches } from 'class-validator';
import { CompletionStatus } from '@common/enums/completion-status.enum';

export class LogCompletionDto {
  @IsEnum(CompletionStatus)
  status!: CompletionStatus;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
  date?: string;
}
