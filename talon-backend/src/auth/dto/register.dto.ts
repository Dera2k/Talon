import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Trim } from '../../common/transformers/trim.transformer';
import { Lowercase } from '../../common/transformers/lowercase.transformer';
import { IsTimezone } from '../../common/validators/is-timezone.validator';
import { Theme } from '../../common/enums/theme.enum';

export class RegisterDto {
  @IsEmail()
  @Trim()
  @Lowercase()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsString()
  @Trim()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Trim()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsTimezone()
  timezone?: string;

  @IsOptional()
  @IsString()
  theme?: Theme;
}
