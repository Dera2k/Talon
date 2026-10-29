import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { Resend } from 'resend';
import { QueueName } from '@common/enums/queue-name.enum';
import { SendEmailJob } from './interfaces/send-email-job.interface';

@Processor(QueueName.EMAIL)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  private readonly resend: Resend | null;
  private readonly from: string;

  constructor(config: ConfigService) {
    super();
    const apiKey = config.get<string>('mail.resendApiKey');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not set; emails will be logged only');
    }
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.from = config.getOrThrow<string>('mail.from');
  }

  async process(job: Job<SendEmailJob>): Promise<void> {
    const { to, subject, html } = job.data;

    if (!this.resend) {
      this.logger.log(`[dev email] to=${to} subject="${subject}"\n${html}`);
      return;
    }

    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject,
      html,
    });
    if (error) throw new Error(error.message);
  }
}
