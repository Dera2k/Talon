import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { NotificationStatus } from '@common/enums/notification-status.enum';
import { NotificationType } from '@common/enums/notification-type.enum';
import { Notification } from '../entities/notification.entity';

export class NotificationResponseDto {
  @ApiProperty({ type: String })
  @IsUUID('4')
  id!: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsUUID('4')
  habitId!: string | null;

  @ApiProperty({ type: String, enum: NotificationType })
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiProperty({ type: String, enum: NotificationStatus })
  @IsEnum(NotificationStatus)
  status!: NotificationStatus;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  message!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  createdAt!: Date;

  static from(notification: Notification): NotificationResponseDto {
    return {
      id: notification.id,
      habitId: notification.habitId,
      type: notification.type,
      status: notification.status,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt,
    };
  }
}
