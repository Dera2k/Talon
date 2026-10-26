import { toast } from "sonner";
import { isApiError } from "@/lib/api/errors";

const FALLBACK = "Something went wrong. Try again.";

export function toastApiError(error: unknown): void {
  if (!isApiError(error)) {
    toast.error(FALLBACK);
    return;
  }
  if (error.status === 429) {
    toast.error("Too many requests. Wait a moment and try again.");
    return;
  }
  toast.error(error.details?.[0] ?? error.message ?? FALLBACK);
}
