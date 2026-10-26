import { isApiError } from "@/lib/api/errors";

export type FormErrors<F extends string> = {
  fields: Partial<Record<F, string>>;
  general?: string;
};

// class-validator messages start with the property name ("name must be..."),
// "each value in <name>", or "All <name>'s elements must be unique".
const FIELD_PATTERNS = [/^All ([A-Za-z_]\w*)'s/, /^(?:each value in )?([A-Za-z_]\w*)/];

function extractField(message: string): string | undefined {
  for (const pattern of FIELD_PATTERNS) {
    const match = pattern.exec(message);
    if (match) return match[1];
  }
  return undefined;
}

export function toFormErrors<F extends string>(
  error: unknown,
  fields: readonly F[],
): FormErrors<F> {
  if (!isApiError(error)) return { fields: {}, general: "Something went wrong. Try again." };

  const result: FormErrors<F> = { fields: {} };
  const unmatched: string[] = [];

  for (const message of error.details ?? []) {
    const name = extractField(message);
    const field = fields.find((candidate) => candidate === name);
    if (field) result.fields[field] ??= message;
    else unmatched.push(message);
  }

  const general = error.details?.length ? unmatched.join(" ") : error.message;
  if (general) result.general = general;
  return result;
}
