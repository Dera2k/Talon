import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueName } from '@common/enums/queue-name.enum';
import { SendEmailJob } from './interfaces/send-email-job.interface';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(QueueName.EMAIL) private readonly queue: Queue<SendEmailJob>,
  ) {}

  async sendPasswordReset(to: string, resetUrl: string): Promise<void> {
    await this.queue.add(
      'send-email',
      {
        to,
        subject: 'Reset your Talon password',
        html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour. If you didn't request it, ignore this email.</p>`,
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5_000 },
        removeOnComplete: true,
      },
    );
  }
}
