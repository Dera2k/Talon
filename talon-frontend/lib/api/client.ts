import { ApiError } from "@/lib/api/errors";
import type { ErrorCode } from "@/lib/api/error-codes";

const BASE_URL = "/api";

type ApiEnvelope =
  | { success: true; data: unknown }
  | { success: false; error: { code: ErrorCode; message: string; details?: string[] } };

type AuthHooks = {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>;
  onAuthFailure: () => void;
};

type QueryValue = string | number | boolean | null | undefined;
export type Query = Record<string, QueryValue>;

type RequestOptions = { query?: Query; body?: unknown; skipAuth?: boolean };

let authHooks: AuthHooks | null = null;

// Registered once by the auth layer, so this module never imports it (no circular dependency).
export function configureApiClient(hooks: AuthHooks): void {
  authHooks = hooks;
}

// The backend rotates refresh tokens and revokes the whole token family when a
// reused token is presented. Concurrent 401s must therefore share one refresh,
// otherwise the second call fails and signs the user out mid-session.
function refreshOnce(hooks: AuthHooks): Promise<string | null> {
  return hooks.refreshAccessToken();
}

function buildUrl(path: string, query?: Query): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  const queryString = params.toString();
  return `${BASE_URL}${path}${queryString ? `?${queryString}` : ""}`;
}

async function send(
  method: string,
  path: string,
  options: RequestOptions,
  token: string | null,
): Promise<Response> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    return await fetch(buildUrl(path, options.query), {
      method,
      headers,
      credentials: "include",
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "Can't reach the server. Check your connection.",
    });
  }
}

async function parse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;

  const body = (await response.json().catch(() => null)) as ApiEnvelope | null;

  if (response.ok && body?.success === true) return body.data as T;

  if (body?.success === false) {
    const { code, message, details } = body.error;
    throw new ApiError({ status: response.status, code, message, details });
  }

  throw new ApiError({
    status: response.status,
    code: "UNKNOWN",
    message: "Unexpected response from the server.",
  });
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const hooks = options.skipAuth ? null : authHooks;
  if (!hooks) return parse<T>(await send(method, path, options, null));

  let response = await send(method, path, options, hooks.getAccessToken());

  if (response.status === 401) {
    let token: string | null = null;
    let refreshError: unknown = null;
    try {
      token = await refreshOnce(hooks);
    } catch (error) {
      refreshError = error;
    }
    if (refreshError) {
      // Network/server error during refresh: don't log the user out, surface the error.
      throw refreshError;
    }
    if (!token) {
      hooks.onAuthFailure();
      return parse<T>(response);
    }
    response = await send(method, path, options, token);
    if (response.status === 401) hooks.onAuthFailure();
  }

  return parse<T>(response);
}

export const api = {
  get: <T>(path: string, query?: Query) => request<T>("GET", path, { query }),
  post: <T>(path: string, body?: unknown, options?: { skipAuth?: boolean }) =>
    request<T>("POST", path, { body, ...options }),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, { body }),
  delete: <T>(path: string, body?: unknown) => request<T>("DELETE", path, { body }),
};
