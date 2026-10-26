import { isApiError } from "@/lib/api/errors";

export type FormErrors<F extends string> = {
  fields: Partial<Record<F, string>>;
  general?: string;
};

// class-validator messages start with the property name ("name must be...") or "each value in <name>".
const FIELD_PATTERN = /^(?:each value in )?([A-Za-z_]\w*)/;

export function toFormErrors<F extends string>(error: unknown, fields: readonly F[]): FormErrors<F> {
  if (!isApiError(error)) return { fields: {}, general: "Something went wrong. Try again." };

  if (error.status === 429) {
    return { fields: {}, general: "Too many attempts. Wait a minute and try again." };
  }

  const result: FormErrors<F> = { fields: {} };
  const unmatched: string[] = [];

  for (const message of error.details ?? []) {
    const name = FIELD_PATTERN.exec(message)?.[1];
    const field = fields.find((candidate) => candidate === name);
    if (field) result.fields[field] ??= message;
    else unmatched.push(message);
  }

  const general = error.details?.length ? unmatched.join(" ") : error.message;
  if (general) result.general = general;
  return result;
}
