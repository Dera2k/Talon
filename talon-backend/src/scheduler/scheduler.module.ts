import { Module } from '@nestjs/common';
import { QueueModule } from '@queues/queue.module';
import { CleanupCron } from './cleanup.cron';
import { RemindersCron } from './reminders.cron';

@Module({
  imports: [QueueModule],
  providers: [RemindersCron, CleanupCron],
})
export class SchedulerModule {}
