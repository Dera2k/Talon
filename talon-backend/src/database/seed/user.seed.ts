import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository('users');

  const existing = await userRepository.findOne({
    where: { email: 'demo@talon.app' },
  });
  if (existing) {
    console.info('Demo user already exists, skipping user seed.');
    return;
  }

  const passwordHash = await bcrypt.hash('demo1234', 12);

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
    const testHash = await bcrypt.hash('12345test', 12);
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
