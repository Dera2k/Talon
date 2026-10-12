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
    password_hash: passwordHash,
    first_name: 'Demo',
    last_name: 'User',
    timezone: 'America/Los_Angeles',
    theme: 'system',
    is_active: true,
    is_verified: true,
  });

  console.info('✓ Demo user created (demo@talon.app / demo1234)');
}
