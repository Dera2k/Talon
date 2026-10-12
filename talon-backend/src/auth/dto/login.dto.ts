import { IsEmail, IsString, MinLength } from 'class-validator';
import { Trim } from '../../common/transformers/trim.transformer';
import { Lowercase } from '../../common/transformers/lowercase.transformer';

export class LoginDto {
  @IsEmail()
  @Trim()
  @Lowercase()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
