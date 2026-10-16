export interface ReminderJob {
  userId: string;
  habitId: string;
  // User-local "YYYY-MM-DD" the reminder is for
  dateKey: string;
}
