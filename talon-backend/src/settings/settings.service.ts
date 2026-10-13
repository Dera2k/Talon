import { HttpStatus, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from '@common/exceptions/app.exception';
import { AuthService } from '@auth/auth.service';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    private readonly users: UsersService,
    private readonly auth: AuthService,
  ) {}

  getSettings(userId: string): Promise<User> {
    return this.users.getById(userId);
  }

  updateSettings(userId: string, dto: UpdateSettingsDto): Promise<User> {
    return this.users.update(userId, dto);
  }

  async changePassword(
    userId: string,
    { currentPassword, newPassword }: ChangePasswordDto,
  ): Promise<void> {
    await this.verifyPassword(userId, currentPassword);

    if (currentPassword === newPassword) {
      throw this.businessError('New password must differ from the current one');
    }

    await this.users.updatePasswordHash(userId, await argon2.hash(newPassword));
    await this.auth.logoutAll(userId);
  }

  async deleteAccount(userId: string, password: string): Promise<void> {
    await this.verifyPassword(userId, password);
    await this.users.softDelete(userId);
    await this.auth.logoutAll(userId);
  }

  private async verifyPassword(
    userId: string,
    password: string,
  ): Promise<void> {
    const user = await this.users.findByIdWithPassword(userId);
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw this.businessError('Password is incorrect');
    }
  }

  private businessError(message: string): AppException {
    return new AppException(
      HttpStatus.BAD_REQUEST,
      ErrorCode.BUSINESS_LOGIC_ERROR,
      message,
    );
  }
}
