import { ReminderProducer } from './reminder.producer';

describe('ReminderProducer', () => {
  const queue = { addBulk: jest.fn() };
  const producer = new ReminderProducer(queue as never);

  beforeEach(() => jest.clearAllMocks());

  it('does nothing for an empty batch', async () => {
    await producer.enqueue([]);
    expect(queue.addBulk).not.toHaveBeenCalled();
  });

  it('uses a deterministic job id and retry options', async () => {
    await producer.enqueue([
      { userId: 'u1', habitId: 'h1', dateKey: '2026-10-16' },
    ]);

    const calls = queue.addBulk.mock.calls as unknown as Array<
      [Array<{ opts: { jobId: string } }>]
    >;
    const [[jobs]] = calls;
    expect(jobs).toHaveLength(1);
    expect(jobs[0].opts).toMatchObject({
      jobId: 'reminder-h1-2026-10-16',
      attempts: 3,
      backoff: { type: 'exponential', delay: 5_000 },
    });
    expect(jobs[0].opts.jobId).not.toContain(':');
  });
});
