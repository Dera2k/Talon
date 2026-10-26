import type { ApiErrorCode } from "@/lib/api/error-codes";

type ApiErrorInit = {
  status: number;
  code: ApiErrorCode;
  message: string;
  details?: string[];
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: string[];

  constructor({ status, code, message, details }: ApiErrorInit) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
