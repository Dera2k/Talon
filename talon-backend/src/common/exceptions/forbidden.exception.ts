import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from './app.exception';

export class AppForbiddenException extends AppException {
  constructor(message = 'You do not have permission to perform this action') {
    super(HttpStatus.FORBIDDEN, ErrorCode.FORBIDDEN, message);
  }
}