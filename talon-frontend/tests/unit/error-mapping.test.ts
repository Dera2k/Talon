import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, isApiError } from "@/lib/api/errors";
import { toastApiError } from "@/lib/api/toast-error";

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

const toastError = vi.mocked(toast.error);

beforeEach(() => {
  toastError.mockClear();
});

describe("isApiError", () => {
  it("only accepts ApiError instances", () => {
    expect(isApiError(new ApiError({ status: 400, code: "UNKNOWN", message: "x" }))).toBe(true);
    expect(isApiError(new Error("x"))).toBe(false);
    expect(isApiError({ status: 400 })).toBe(false);
  });
});

describe("toastApiError", () => {
  it("shows a generic message for unknown errors", () => {
    toastApiError(new Error("boom"));
    expect(toastError).toHaveBeenCalledWith("Something went wrong. Try again.");
  });

  it("shows a friendly message for 429", () => {
    toastApiError(new ApiError({ status: 429, code: "RATE_LIMITED", message: "ThrottlerException" }));
    expect(toastError).toHaveBeenCalledWith("Too many requests. Wait a moment and try again.");
  });

  it("prefers the first validation detail", () => {
    toastApiError(
      new ApiError({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: ["name must be shorter than or equal to 100 characters", "second"],
      }),
    );
    expect(toastError).toHaveBeenCalledWith("name must be shorter than or equal to 100 characters");
  });

  it("falls back to the error message", () => {
    toastApiError(new ApiError({ status: 409, code: "CONFLICT", message: "Already exists" }));
    expect(toastError).toHaveBeenCalledWith("Already exists");
  });
});
