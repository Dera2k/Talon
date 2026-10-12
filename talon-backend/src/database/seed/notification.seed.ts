/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { DataSource } from 'typeorm';

export async function seedNotifications(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository('users');

  const habitRepository = dataSource.getRepository('habits');

  const notificationRepository = dataSource.getRepository('notifications');

  const user = await userRepository.findOne({
    where: { email: 'demo@talon.app' },
  });
  if (!user) {
    console.warn('Demo user not found, skipping notification seed.');
    return;
  }

  const habits = await habitRepository.find({ where: { user_id: user.id } });
  if (habits.length === 0) {
    console.warn('No habits found for demo user, skipping notification seed.');
    return;
  }

  const existing = await notificationRepository.count({
    where: { user_id: user.id },
  });
  if (existing > 0) {
    console.info(
      'Notifications already exist for demo user, skipping notification seed.',
    );
    return;
  }

  const exerciseHabit = habits.find((h) => h.name === 'Exercise');

  const readHabit = habits.find((h) => h.name === 'Read');

  await notificationRepository.insert([
    {
      user_id: user.id,
      habit_id: exerciseHabit?.id ?? null,
      type: 'reminder',
      title: 'Time to exercise!',
      message: "Your daily workout is scheduled for now. Let's get moving!",
      status: 'unread',
      data: { habit_name: 'Exercise' },
    },
    {
      user_id: user.id,
      habit_id: readHabit?.id ?? null,
      type: 'reminder',
      title: 'Reading time',
      message: "Don't forget to read your 20 pages today.",
      status: 'unread',
      data: { habit_name: 'Read' },
    },
    {
      user_id: user.id,
      habit_id: null,
      type: 'streak_milestone',
      title: 'Welcome to Talon!',
      message: "You've set up your first habits. Start building streaks today!",
      status: 'unread',
      data: { streak_count: 0 },
    },
    {
      user_id: user.id,
      habit_id: null,
      type: 'tip',
      title: 'Pro tip: Consistency over intensity',
      message:
        'Small daily actions beat occasional big efforts. Keep your streaks alive!',
      status: 'read',
      read_at: new Date(),
      data: {},
    },
  ]);

  console.info('✓ 4 demo notifications created');
}
