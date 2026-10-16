import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueName } from '@common/enums/queue-name.enum';
import { ReminderProducer } from './producers/reminder.producer';

@Module({
  imports: [BullModule.registerQueue({ name: QueueName.REMINDERS })],
  providers: [ReminderProducer],
  exports: [ReminderProducer],
})
export class QueueModule {}
