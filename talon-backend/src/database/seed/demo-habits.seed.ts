import { DataSource } from 'typeorm';

const HABITS = [
  { name: 'Exercise', description: 'Complete a short workout or a brisk walk.', color: 'red', icon: 'dumbbell', frequency: 'daily', target_count: 1, schedule: { type: 'daily', time_of_day: '07:00:00', reminder_minutes_before: 15 } },
  { name: 'Read', description: 'Read a book for at least ten minutes.', color: 'blue', icon: 'book', frequency: 'daily', target_count: 1, schedule: { type: 'daily', time_of_day: '21:00:00', reminder_minutes_before: 30 } },
  { name: 'Hydrate', description: 'Drink enough water throughout the day.', color: 'teal', icon: 'droplet', frequency: 'daily', target_count: 1, schedule: { type: 'daily', time_of_day: '10:00:00', reminder_minutes_before: 15 } },
  { name: 'Journal', description: 'Write down your thoughts or reflect on the day.', color: 'purple', icon: 'pen', frequency: 'daily', target_count: 1, schedule: { type: 'daily', time_of_day: '20:30:00', reminder_minutes_before: 30 } },
  { name: 'Sleep', description: 'Go to bed early enough to get seven to nine hours of sleep.', color: 'indigo', icon: 'moon', frequency: 'daily', target_count: 1, schedule: { type: 'daily', time_of_day: '22:00:00', reminder_minutes_before: 60 } },
  { name: 'Plan Week', description: 'Review your priorities and plan the week ahead.', color: 'orange', icon: 'calendar', frequency: 'weekly', target_count: 1, schedule: { type: 'weekly', time_of_day: '18:00:00', reminder_minutes_before: 30, daysOfWeek: [0] } },
  { name: 'Meal Prep', description: 'Prepare healthy meals or ingredients for the coming days.', color: 'green', icon: 'apple', frequency: 'weekly', target_count: 1, schedule: { type: 'weekly', time_of_day: '16:00:00', reminder_minutes_before: 60, daysOfWeek: [0] } },
  { name: 'Review Goals', description: 'Review your monthly progress and set priorities for the next month.', color: 'pink', icon: 'clipboard', frequency: 'weekly', target_count: 1, schedule: { type: 'weekly', time_of_day: '17:00:00', reminder_minutes_before: 60, daysOfWeek: [0] } },
];

export async function seedDemoHabits(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository('users');
  const habitRepository = dataSource.getRepository('habits');
  const scheduleRepository = dataSource.getRepository('habit_schedules');

  const user = await userRepository.findOne({ where: { email: 'test@test.com' } });
  if (!user) {
    console.warn('Test user not found, skipping demo habit seed.');
    return;
  }

  const existing = await habitRepository.count({ where: { userId: user.id } });
  if (existing > 0) {
    console.info('Habits already exist for test user, skipping.');
    return;
  }

  for (const h of HABITS) {
    const habit = await habitRepository.save({
      userId: user.id,
      name: h.name,
      description: h.description,
      color: h.color,
      icon: h.icon,
      frequency: h.frequency,
      target_count: h.target_count,
    });
    await scheduleRepository.save({
      habitId: habit.id,
      type: h.schedule.type,
      time_of_day: h.schedule.time_of_day,
      timezone: 'UTC',
      reminder_enabled: true,
      reminder_minutes_before: h.schedule.reminder_minutes_before,
      daysOfWeek: h.schedule.daysOfWeek ?? [],
    });
  }
  console.info(`✓ ${HABITS.length} demo habits created for test@test.com`);
}
