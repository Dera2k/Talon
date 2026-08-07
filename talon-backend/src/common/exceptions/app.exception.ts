import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@common/enums/error-code.enum';

export class AppException extends HttpException {
  constructor(
    status: HttpStatus,
    public readonly code: ErrorCode,
    message: string,
  ) {
    super({ statusCode: status, code, message }, status);
  }
}