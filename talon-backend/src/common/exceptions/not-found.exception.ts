import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from './app.exception';

export class AppNotFoundException extends AppException {
  constructor(message = 'Resource not found') {
    super(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, message);
  }
}
