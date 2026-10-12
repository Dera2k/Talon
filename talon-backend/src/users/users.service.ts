import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from '@common/exceptions/app.exception';
import { User } from './entities/user.entity';

const PG_UNIQUE_VIOLATION = '23505';

export type CreateUserData = Pick<User, 'email' | 'passwordHash'> &
  Partial<Pick<User, 'firstName' | 'lastName' | 'timezone'>>;

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
}
