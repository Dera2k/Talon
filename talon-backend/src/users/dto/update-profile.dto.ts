import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Trim } from '@common/transformers/trim.transformer';

export class UpdateProfileDto {
  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  firstName?: string | null;

  @IsOptional()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  lastName?: string | null;
}
