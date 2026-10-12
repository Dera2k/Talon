import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from './app.exception';

export class AppConflictException extends AppException {
  constructor(message = 'Resource already exists') {
    super(HttpStatus.CONFLICT, ErrorCode.CONFLICT, message);
  }
}