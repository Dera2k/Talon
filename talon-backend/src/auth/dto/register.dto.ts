import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { Lowercase } from '../../common/transformers/lowercase.transformer';
import { Trim } from '../../common/transformers/trim.transformer';
import { IsPasswordStrong } from '../../common/validators/password-strength.validator';
import { IsTimezone } from '../../common/validators/is-timezone.validator';

export class RegisterDto {
  @ApiProperty()
  @Trim()
  @Lowercase()
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({ minLength: 8, maxLength: 128 })
  @IsPasswordStrong()
  password!: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiPropertyOptional({ maxLength: 50 })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsTimezone()
  timezone?: string;
}
