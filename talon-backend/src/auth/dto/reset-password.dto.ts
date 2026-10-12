import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsPasswordStrong } from '../../common/validators/password-strength.validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  token!: string;

  @IsPasswordStrong()
  newPassword!: string;
}
