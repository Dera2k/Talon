import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { NotificationStatus } from '@common/enums/notification-status.enum';

export class NotificationQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;
}
