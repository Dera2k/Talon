import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueName } from '@common/enums/queue-name.enum';
import { CompletionsModule } from '@completions/completions.module';
import { HabitsModule } from '@habits/habits.module';
import { NotificationsModule } from '@notifications/notifications.module';
import { UsersModule } from '@users/users.module';
import { ReminderProcessor } from './processors/reminder.processor';
import { ReminderProducer } from './producers/reminder.producer';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueName.REMINDERS }),
    CompletionsModule,
    HabitsModule,
    NotificationsModule,
    UsersModule,
  ],
  providers: [ReminderProducer, ReminderProcessor],
  exports: [ReminderProducer],
})
export class QueueModule {}
