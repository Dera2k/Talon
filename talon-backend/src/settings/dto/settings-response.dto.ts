import { Theme } from '@common/enums/theme.enum';
import { User } from '@users/entities/user.entity';

export class SettingsResponseDto {
  timezone!: string;
  theme!: Theme;

  static from(user: User): SettingsResponseDto {
    return { timezone: user.timezone, theme: user.theme };
  }
}
