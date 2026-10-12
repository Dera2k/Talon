import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueName } from '@common/enums/queue-name.enum';
import { EmailProcessor } from './email.processor';
import { MailService } from './mail.service';

@Module({
  imports: [BullModule.registerQueue({ name: QueueName.EMAIL })],
  providers: [MailService, EmailProcessor],
  exports: [MailService],
})
export class MailModule {}
