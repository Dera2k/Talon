import { applyDecorators } from '@nestjs/common';
import { IsString, IsStrongPassword, MaxLength } from 'class-validator';

export const IsPasswordStrong = () =>
  applyDecorators(IsString(), IsStrongPassword(), MaxLength(128));
