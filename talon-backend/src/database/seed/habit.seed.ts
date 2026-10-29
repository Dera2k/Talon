/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { DataSource } from 'typeorm';

export async function seedHabits(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository('users');

  const habitRepository = dataSource.getRepository('habits');

  const scheduleRepository = dataSource.getRepository('habit_schedules');

  const user = await userRepository.findOne({
    where: { email: 'demo@talon.app' },
  });
  if (!user) {
    console.warn('Demo user not found, skipping habit seed.');
    return;
  }

  const existingHabits = await habitRepository.count({
    where: { userId: user.id },
  });
  if (existingHabits > 0) {
    console.info('Habits already exist for demo user, skipping habit seed.');
    return;
  }

  // Habit 1: Daily exercise

  const exerciseHabit = await habitRepository.save({
    userId: user.id,
    name: 'Exercise',
    description: '30 minutes of physical activity',
    color: 'red',
    icon: 'dumbbell',
    frequency: 'daily',
    target_count: 1,
  });

  await scheduleRepository.save({
    habitId: exerciseHabit.id,
    type: 'daily',
    time_of_day: '07:00:00',
    timezone: user.timezone,
    reminder_enabled: true,
    reminder_minutes_before: 15,
    daysOfWeek: [],
  });

  // Habit 2: Read daily

  const readHabit = await habitRepository.save({
    userId: user.id,
    name: 'Read',
    description: 'Read 20 pages',
    color: 'blue',
    icon: 'book',
    frequency: 'daily',
    target_count: 1,
  });

  await scheduleRepository.save({
    habitId: readHabit.id,
    type: 'daily',
    time_of_day: '21:00:00',
    timezone: user.timezone,
    reminder_enabled: true,
    reminder_minutes_before: 30,
    daysOfWeek: [],
  });

  // Habit 3: Weekly planning (weekly)

  const planningHabit = await habitRepository.save({
    userId: user.id,
    name: 'Weekly Planning',
    description: 'Plan the week ahead',
    color: 'purple',
    icon: 'calendar',
    frequency: 'weekly',
    target_count: 1,
  });

  await scheduleRepository.save({
    habitId: planningHabit.id,
    type: 'weekly',
    daysOfWeek: [0], // Sunday
    time_of_day: '10:00:00',
    timezone: user.timezone,
    reminder_enabled: true,
    reminder_minutes_before: 60,
  });

  // Habit 4: Monthly review (monthly)

  const reviewHabit = await habitRepository.save({
    userId: user.id,
    name: 'Monthly Review',
    description: 'Review goals and progress',
    color: 'orange',
    icon: 'clipboard',
    frequency: 'monthly',
    target_count: 1,
  });

  await scheduleRepository.save({
    habitId: reviewHabit.id,
    type: 'monthly',
    day_of_month: 1,
    time_of_day: '09:00:00',
    timezone: user.timezone,
    reminder_enabled: true,
    reminder_minutes_before: 120,
    daysOfWeek: [],
  });

  console.info('✓ 4 demo habits created with schedules');
}
