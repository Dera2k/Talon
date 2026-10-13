import { Theme } from '@common/enums/theme.enum';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  id!: string;
  email!: string;
  firstName!: string | null;
  lastName!: string | null;
  timezone!: string;
  theme!: Theme;
  createdAt!: Date;

  static from(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      timezone: user.timezone,
      theme: user.theme,
      createdAt: user.createdAt,
    };
  }
}
