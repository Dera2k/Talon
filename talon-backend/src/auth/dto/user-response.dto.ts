import { User } from '../../users/entities/user.entity';

export class UserResponseDto {
  id!: string;
  email!: string;
  firstName!: string | null;
  lastName!: string | null;
  timezone!: string;
  theme!: string;
  isActive!: boolean;
  isVerified!: boolean;
  createdAt!: Date;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.timezone = user.timezone;
    dto.theme = user.theme;
    dto.isActive = user.isActive;
    dto.isVerified = user.isVerified;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
