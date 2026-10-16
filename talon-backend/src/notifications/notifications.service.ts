import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotificationStatus } from '@common/enums/notification-status.enum';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { Notification } from './entities/notification.entity';

export type CreateNotificationData = Pick<
  Notification,
  'userId' | 'type' | 'title' | 'message'
> &
  Partial<Pick<Notification, 'habitId'>>;

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifications: Repository<Notification>,
  ) {}

  create(data: CreateNotificationData): Promise<Notification> {
    return this.notifications.save(this.notifications.create(data));
  }

  async list(userId: string, query: NotificationQueryDto) {
    const { page, limit, status } = query;
    const [items, total] = await this.notifications.findAndCount({
      where: { userId, ...(status && { status }) },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  countUnread(userId: string): Promise<number> {
    return this.notifications.countBy({
      userId,
      status: NotificationStatus.UNREAD,
    });
  }

  async markRead(userId: string, ids: string[]): Promise<void> {
    await this.notifications.update(
      { userId, id: In(ids), status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ },
    );
  }

  async markAllRead(userId: string): Promise<void> {
    await this.notifications.update(
      { userId, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ },
    );
  }
}
