import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RefreshTokenDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  refreshToken?: string;
}
