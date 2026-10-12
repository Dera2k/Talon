import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Theme } from '@common/enums/theme.enum';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    timezone?: string;
    theme?: Theme;
  }): Promise<User> {
    const user = this.userRepository.create({
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      timezone: data.timezone ?? 'UTC',
      theme: data.theme ?? Theme.SYSTEM,
      isActive: true,
      isVerified: false,
    });
    return this.userRepository.save(user);
  }
}
