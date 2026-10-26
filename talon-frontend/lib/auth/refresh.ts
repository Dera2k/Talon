import { authApi } from "@/lib/api/endpoints/auth";
import { isApiError } from "@/lib/api/errors";
import { setAccessToken } from "@/lib/auth/token-store";

const MULTI_TAB_RETRY_DELAY_MS = 250;

let inFlight: Promise<string | null> | null = null;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isUnauthorized = (error: unknown) => isApiError(error) && error.status === 401;

async function attempt(): Promise<string> {
  const { accessToken } = await authApi.refresh();
  return accessToken;
}

// A 401 can mean another tab rotated the cookie a moment ago, so retry once before giving up.
// Network and server errors are rethrown, so a flaky connection never logs the user out.
async function refreshWithRetry(): Promise<string | null> {
  try {
    return await attempt();
  } catch (error) {
    if (!isUnauthorized(error)) throw error;
  }

  await wait(MULTI_TAB_RETRY_DELAY_MS);

  try {
    return await attempt();
  } catch (error) {
    if (isUnauthorized(error)) return null;
    throw error;
  }
}

// Single-flight: concurrent callers share one request, so a burst of 401s can't trigger
// several rotations and trip the backend's replay detection.
export function refreshAccessToken(): Promise<string | null> {
  inFlight ??= refreshWithRetry()
    .then((token) => {
      setAccessToken(token);
      return token;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}
