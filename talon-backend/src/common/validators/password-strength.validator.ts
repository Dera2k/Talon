import { applyDecorators } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';

export const IsPasswordStrong = () =>
  applyDecorators(
    IsString(),
    MinLength(8),
    MaxLength(128),
  );
