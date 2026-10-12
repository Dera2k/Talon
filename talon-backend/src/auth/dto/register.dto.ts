import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { Lowercase } from '../../common/transformers/lowercase.transformer';
import { Trim } from '../../common/transformers/trim.transformer';
import { IsPasswordStrong } from '../../common/validators/password-strength.validator';
import { IsTimezone } from '../../common/validators/is-timezone.validator';

export class RegisterDto {
  @Trim()
  @Lowercase()
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsPasswordStrong()
  password!: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @IsOptional()
  @IsTimezone()
  timezone?: string;
}
