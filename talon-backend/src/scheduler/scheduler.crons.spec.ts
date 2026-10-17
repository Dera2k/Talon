jest.mock('@nestjs/schedule', () => ({
  Cron: () => () => {},
  CronExpression: { EVERY_MINUTE: '* * * * *' },
}));

import { CleanupCron } from './cleanup.cron';
import { RemindersCron } from './reminders.cron';

describe('RemindersCron', () => {
  const dataSource = { query: jest.fn() };
  const producer = { enqueue: jest.fn() };
  const cron = new RemindersCron(dataSource as never, producer as never);

  beforeEach(() => jest.clearAllMocks());

  it('enqueues the rows returned by the due-reminders query', async () => {
    const rows = [{ habitId: 'h1', userId: 'u1', dateKey: '2026-10-16' }];
    dataSource.query.mockResolvedValue(rows);

    await cron.enqueueDueReminders();

    expect(producer.enqueue).toHaveBeenCalledWith(rows);
  });

  it('logs and swallows query failures so the next minute still runs', async () => {
    dataSource.query.mockRejectedValue(new Error('column does not exist'));

    await expect(cron.enqueueDueReminders()).resolves.toBeUndefined();
    expect(producer.enqueue).not.toHaveBeenCalled();
  });
});

describe('CleanupCron', () => {
  const repo = { delete: jest.fn() };
  const dataSource = { getRepository: jest.fn(() => repo) };
  const cron = new CleanupCron(dataSource as never);

  beforeEach(() => {
    jest.clearAllMocks();
    repo.delete.mockResolvedValue({ affected: 1 });
  });

  it('runs all four cleanup steps', async () => {
    await cron.run();
    expect(repo.delete).toHaveBeenCalledTimes(4);
  });

  it('keeps going when one step fails', async () => {
    repo.delete.mockRejectedValueOnce(new Error('boom'));
    await expect(cron.run()).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledTimes(4);
  });
});
