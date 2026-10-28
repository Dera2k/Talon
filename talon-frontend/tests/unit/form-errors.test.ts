import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { toFormErrors } from "@/lib/api/form-errors";

const FIELDS = ["name", "icon", "weekdays"] as const;

const validation = (details: string[]) =>
  new ApiError({ status: 400, code: "VALIDATION_ERROR", message: "Validation failed", details });

describe("toFormErrors", () => {
  it("returns a generic message for non-API errors", () => {
    expect(toFormErrors(new Error("boom"), FIELDS)).toEqual({
      fields: {},
      general: "Something went wrong. Try again.",
    });
  });

  it("returns a clear message for 429", () => {
    const error = new ApiError({ status: 429, code: "RATE_LIMITED", message: "ThrottlerException" });
    expect(toFormErrors(error, FIELDS).general).toBe(
      "Too many attempts. Wait a minute and try again.",
    );
  });

  it("attaches each detail to the field its message starts with", () => {
    const result = toFormErrors(
      validation(["name must be shorter than or equal to 100 characters", "icon must be a string"]),
      FIELDS,
    );

    expect(result.fields.name).toBe("name must be shorter than or equal to 100 characters");
    expect(result.fields.icon).toBe("icon must be a string");
    expect(result.general).toBeUndefined();
  });

  it("understands class-validator's 'each value in' prefix", () => {
    const result = toFormErrors(validation(["each value in weekdays must not be greater than 6"]), FIELDS);
    expect(result.fields.weekdays).toBe("each value in weekdays must not be greater than 6");
  });

  it("keeps the first message when a field has several", () => {
    const result = toFormErrors(validation(["name should not be empty", "name must be a string"]), FIELDS);
    expect(result.fields.name).toBe("name should not be empty");
  });

  it("puts details that match no field into the general message", () => {
    const result = toFormErrors(validation(["something unexpected happened"]), FIELDS);
    expect(result.fields).toEqual({});
    expect(result.general).toBe("something unexpected happened");
  });

  it("uses the error message when there are no details", () => {
    const error = new ApiError({ status: 409, code: "CONFLICT", message: "Email already in use" });
    expect(toFormErrors(error, FIELDS)).toEqual({ fields: {}, general: "Email already in use" });
  });
});
