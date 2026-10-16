import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from '@common/exceptions/app.exception';
import { User } from './entities/user.entity';
import { getLocalDateKey } from '@common/utils/timezone.util';

const PG_UNIQUE_VIOLATION = '23505';

export type CreateUserData = Pick<User, 'email' | 'passwordHash'> &
  Partial<Pick<User, 'firstName' | 'lastName' | 'timezone'>>;

export type UpdatableUserFields = Partial<
  Pick<User, 'firstName' | 'lastName' | 'timezone' | 'theme'>
>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.users.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.users.findOneBy({ email });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(data: CreateUserData): Promise<User> {
    try {
      return await this.users.save(this.users.create(data));
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === PG_UNIQUE_VIOLATION
      ) {
        throw new AppException(
          HttpStatus.CONFLICT,
          ErrorCode.CONFLICT,
          'Email is already registered',
        );
      }
      throw error;
    }
  }

  async getById(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new AppException(
        HttpStatus.NOT_FOUND,
        ErrorCode.NOT_FOUND,
        'User not found',
      );
    }
    return user;
  }

  async update(id: string, data: UpdatableUserFields): Promise<User> {
    const user = await this.getById(id);
    return this.users.save(Object.assign(user, data));
  }

  findByIdWithPassword(id: string): Promise<User | null> {
    return this.users
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id })
      .getOne();
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.users.update(id, { passwordHash });
  }

  async softDelete(id: string): Promise<void> {
    await this.users.softDelete(id);
  }

  async getTodayKey(id: string): Promise<string> {
    const { timezone } = await this.getById(id);
    return getLocalDateKey(timezone);
  }
}
