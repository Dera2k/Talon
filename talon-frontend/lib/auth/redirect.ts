import { APP_HOME_PATH } from "@/lib/auth/constants";

// Only same-origin paths are accepted, so ?next= can't be used as an open redirect.
export function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return APP_HOME_PATH;
  }
  return next;
}
