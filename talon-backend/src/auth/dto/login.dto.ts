import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Lowercase } from '../../common/transformers/lowercase.transformer';
import { Trim } from '../../common/transformers/trim.transformer';

export class LoginDto {
  @Trim()
  @Lowercase()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password!: string;
}
