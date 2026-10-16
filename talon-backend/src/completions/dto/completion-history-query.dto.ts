import { IsOptional, IsUUID, Matches } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

export class CompletionHistoryQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  habitId?: string;

  @IsOptional()
  @Matches(DATE_KEY, { message: 'from must be YYYY-MM-DD' })
  from?: string;

  @IsOptional()
  @Matches(DATE_KEY, { message: 'to must be YYYY-MM-DD' })
  to?: string;
}
