import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationType } from '@common/enums/notification-type.enum';
import { QueueName } from '@common/enums/queue-name.enum';
import { ReminderJob } from '@common/interfaces/queue-job.interface';
import { CompletionsService } from '@completions/completions.service';
import { HabitsService } from '@habits/habits.service';
import { NotificationsService } from '@notifications/notifications.service';
import { UsersService } from '@users/users.service';

@Processor(QueueName.REMINDERS, { concurrency: 5 })
export class ReminderProcessor extends WorkerHost {
  constructor(
    private readonly users: UsersService,
    private readonly habits: HabitsService,
    private readonly completions: CompletionsService,
    private readonly notifications: NotificationsService,
  ) {
    super();
  }

  async process(job: Job<ReminderJob>): Promise<void> {
    const { userId, habitId, dateKey } = job.data;

    const [user, habit] = await Promise.all([
      this.users.findById(userId),
      this.habits.findActiveById(userId, habitId),
    ]);
    if (!user || !habit?.reminderTime) return;

    if (await this.completions.hasEntry(habitId, dateKey)) return;

    await this.notifications.create({
      userId,
      habitId,
      type: NotificationType.REMINDER,
      title: habit.name,
      message: `Time to complete "${habit.name}"`,
    });
  }
}
