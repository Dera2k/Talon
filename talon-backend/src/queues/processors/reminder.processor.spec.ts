import { Job } from 'bullmq';
import { NotificationType } from '@common/enums/notification-type.enum';
import { ReminderJob } from '@common/interfaces/queue-job.interface';
import { ReminderProcessor } from './reminder.processor';

const jobData: ReminderJob = {
  userId: 'u1',
  habitId: 'h1',
  dateKey: '2026-10-16',
};
const job = { data: jobData } as Job<ReminderJob>;

describe('ReminderProcessor', () => {
  const users = { findById: jest.fn() };
  const habits = { findActiveById: jest.fn() };
  const completions = { hasEntry: jest.fn() };
  const notifications = { create: jest.fn() };
  let processor: ReminderProcessor;

  beforeEach(() => {
    jest.clearAllMocks();
    users.findById.mockResolvedValue({ id: 'u1' });
    habits.findActiveById.mockResolvedValue({
      id: 'h1',
      name: 'Read',
      reminderTime: '08:00',
    });
    completions.hasEntry.mockResolvedValue(false);
    processor = new ReminderProcessor(
      users as never,
      habits as never,
      completions as never,
      notifications as never,
    );
  });

  it('creates a notification when the reminder is still relevant', async () => {
    await processor.process(job);
    expect(notifications.create).toHaveBeenCalledWith({
      userId: 'u1',
      habitId: 'h1',
      type: NotificationType.REMINDER,
      title: 'Read',
      message: 'Time to complete "Read"',
    });
  });

  it.each([
    ['the user is gone', () => users.findById.mockResolvedValue(null)],
    [
      'the habit is archived or gone',
      () => habits.findActiveById.mockResolvedValue(null),
    ],
    [
      'the habit lost its reminder time',
      () =>
        habits.findActiveById.mockResolvedValue({
          id: 'h1',
          name: 'Read',
          reminderTime: null,
        }),
    ],
    [
      'the habit is already handled today',
      () => completions.hasEntry.mockResolvedValue(true),
    ],
  ])('skips quietly when %s', async (_label, arrange) => {
    arrange();
    await expect(processor.process(job)).resolves.toBeUndefined();
    expect(notifications.create).not.toHaveBeenCalled();
  });

  it('rethrows infrastructure errors so BullMQ retries', async () => {
    completions.hasEntry.mockRejectedValue(new Error('db down'));
    await expect(processor.process(job)).rejects.toThrow('db down');
  });
});
