import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueName } from '@common/enums/queue-name.enum';
import { ReminderJob } from '@common/interfaces/queue-job.interface';

const ONE_DAY_S = 24 * 60 * 60;

@Injectable()
export class ReminderProducer {
  constructor(
    @InjectQueue(QueueName.REMINDERS)
    private readonly queue: Queue<ReminderJob>,
  ) {}

  async enqueue(jobs: ReminderJob[]): Promise<void> {
    if (!jobs.length) return;

    await this.queue.addBulk(
      jobs.map((job) => ({
        name: 'send-reminder',
        data: job,
        opts: {
          jobId: `reminder-${job.habitId}-${job.dateKey}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 5_000 },
          removeOnComplete: { age: ONE_DAY_S },
          removeOnFail: { age: 7 * ONE_DAY_S },
        },
      })),
    );
  }
}
