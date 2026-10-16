import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReminderJob } from '@common/interfaces/queue-job.interface';
import { ReminderProducer } from '@queues/producers/reminder.producer';

const DUE_REMINDERS_SQL = `
  SELECT
    h.id AS "habitId",
    h.user_id AS "userId",
    to_char(now() AT TIME ZONE u.timezone, 'YYYY-MM-DD') AS "dateKey"
  FROM habits h
  JOIN users u ON u.id = h.user_id
  JOIN habit_schedules s ON s.habit_id = h.id
  WHERE h.archived_at IS NULL
    AND u.timezone IN (SELECT name FROM pg_timezone_names)
    AND h.reminder_time = to_char(now() AT TIME ZONE u.timezone, 'HH24:MI')
    AND EXTRACT(DOW FROM now() AT TIME ZONE u.timezone)::int = ANY (s.days_of_week)
    AND NOT EXISTS (
      SELECT 1 FROM habit_completions c
      WHERE c.habit_id = h.id
        AND c.date = (now() AT TIME ZONE u.timezone)::date
    )
`;

@Injectable()
export class RemindersCron {
  private readonly logger = new Logger(RemindersCron.name);

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly producer: ReminderProducer,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async enqueueDueReminders(): Promise<void> {
    try {
      const due: ReminderJob[] = await this.dataSource.query(DUE_REMINDERS_SQL);
      await this.producer.enqueue(due);
    } catch (error) {
      this.logger.error('Failed to enqueue due reminders', String(error));
    }
  }
}
