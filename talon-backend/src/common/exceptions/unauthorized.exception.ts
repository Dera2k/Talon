import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from './app.exception';

export class AppUnauthorizedException extends AppException {
  constructor(message = 'Authentication is required') {
    super(HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, message);
  }
}