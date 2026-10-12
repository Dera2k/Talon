import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '@common/enums/error-code.enum';
import { AppException } from '@common/exceptions/app.exception';

interface ErrorBody {
  code: ErrorCode;
  message: string;
  details?: string[];
}

const STATUS_TO_ERROR_CODE: Partial<Record<number, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.VALIDATION_ERROR,
  [HttpStatus.UNAUTHORIZED]: ErrorCode.UNAUTHORIZED,
  [HttpStatus.FORBIDDEN]: ErrorCode.FORBIDDEN,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  [HttpStatus.CONFLICT]: ErrorCode.CONFLICT,
  [HttpStatus.TOO_MANY_REQUESTS]: ErrorCode.RATE_LIMITED,
  [HttpStatus.SERVICE_UNAVAILABLE]: ErrorCode.SERVICE_UNAVAILABLE,
};

const INTERNAL_SERVER_ERROR_STATUS = Number(HttpStatus.INTERNAL_SERVER_ERROR);

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const { status, error } = this.resolve(exception);

    if (status >= INTERNAL_SERVER_ERROR_STATUS) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      success: false,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private resolve(exception: unknown): { status: number; error: ErrorBody } {
    if (exception instanceof AppException) {
      return {
        status: exception.getStatus(),
        error: { code: exception.code, message: exception.message },
      };
    }

    if (exception instanceof HttpException) {
      return this.fromHttpException(exception);
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      },
    };
  }

  private fromHttpException(exception: HttpException): {
    status: number;
    error: ErrorBody;
  } {
    const status = exception.getStatus();
    const body = exception.getResponse();
    const message =
      typeof body === 'object' && 'message' in body
        ? (body as { message: string | string[] }).message
        : exception.message;

    if (Array.isArray(message)) {
      return {
        status,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Validation failed',
          details: message,
        },
      };
    }

    const fallback =
      status >= INTERNAL_SERVER_ERROR_STATUS
        ? ErrorCode.INTERNAL_SERVER_ERROR
        : ErrorCode.BUSINESS_LOGIC_ERROR;

    return {
      status,
      error: { code: STATUS_TO_ERROR_CODE[status] ?? fallback, message },
    };
  }
}
