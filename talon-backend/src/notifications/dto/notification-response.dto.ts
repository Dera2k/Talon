import { NotificationStatus } from '@common/enums/notification-status.enum';
import { NotificationType } from '@common/enums/notification-type.enum';
import { Notification } from '../entities/notification.entity';

export class NotificationResponseDto {
  id!: string;
  habitId!: string | null;
  type!: NotificationType;
  status!: NotificationStatus;
  title!: string;
  message!: string;
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
