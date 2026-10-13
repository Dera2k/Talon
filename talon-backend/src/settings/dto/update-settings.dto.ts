import { IsEnum, IsOptional } from 'class-validator';
import { Theme } from '@common/enums/theme.enum';
import { IsTimezone } from '@common/validators/is-timezone.validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsTimezone()
  timezone?: string;

  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;
}
