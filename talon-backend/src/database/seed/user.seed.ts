import { DataSource } from 'typeorm';
import * as argon2 from 'argon2';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository('users');

  const existing = await userRepository.findOne({
    where: { email: 'demo@talon.app' },
  });
  if (existing) {
    console.info('Demo user already exists, skipping user seed.');
    return;
  }

  const passwordHash = await argon2.hash('demo1234');

  await userRepository.insert({
    email: 'demo@talon.app',
    passwordHash: passwordHash,
    first_name: 'Demo',
    last_name: 'User',
    timezone: 'America/Los_Angeles',
    theme: 'system',
    is_active: true,
    is_verified: true,
  });

  console.info('✓ Demo user created (demo@talon.app / demo1234)');

  const existingTest = await userRepository.findOne({ where: { email: 'test@test.com' } });
  if (!existingTest) {
    const testHash = await argon2.hash('12345test');
    await userRepository.insert({
      email: 'test@test.com',
      passwordHash: testHash,
      first_name: 'test',
      last_name: 'account',
      timezone: 'UTC',
      theme: 'system',
      is_active: true,
      is_verified: true,
    });
    console.info('✓ Test user created (test@test.com / 12345test)');
  }
}
