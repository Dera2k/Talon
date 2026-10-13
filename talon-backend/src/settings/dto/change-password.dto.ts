import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsPasswordStrong } from '@common/validators/password-strength.validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  currentPassword!: string;

  @IsPasswordStrong()
  newPassword!: string;
}
