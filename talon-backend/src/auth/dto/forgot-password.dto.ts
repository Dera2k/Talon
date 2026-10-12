import { IsEmail } from 'class-validator';
import { Trim } from '../../common/transformers/trim.transformer';
import { Lowercase } from '../../common/transformers/lowercase.transformer';

export class ForgotPasswordDto {
  @IsEmail()
  @Trim()
  @Lowercase()
  email!: string;
}
