import { In } from 'typeorm';
import { NotificationStatus } from '@common/enums/notification-status.enum';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  const repo = { update: jest.fn(), countBy: jest.fn() };
  const service = new NotificationsService(repo as never);

  beforeEach(() => jest.clearAllMocks());

  it('markRead is scoped to the user and only touches unread rows', async () => {
    await service.markRead('u1', ['n1', 'n2']);
    expect(repo.update).toHaveBeenCalledWith(
      { userId: 'u1', id: In(['n1', 'n2']), status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ },
    );
  });

  it("counts only the user's unread notifications", async () => {
    repo.countBy.mockResolvedValue(3);
    await expect(service.countUnread('u1')).resolves.toBe(3);
    expect(repo.countBy).toHaveBeenCalledWith({
      userId: 'u1',
      status: NotificationStatus.UNREAD,
    });
  });
});
