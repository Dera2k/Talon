import { configureApiClient } from "@/lib/api/client";
import { authApi } from "@/lib/api/endpoints/auth";
import type { LoginInput, RegisterInput } from "@/lib/api/types";
import { refreshAccessToken } from "@/lib/auth/refresh";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth/token-store";

type Listener = () => void;

let sessionExpiredListener: Listener | null = null;

export function onSessionExpired(listener: Listener | null): void {
  sessionExpiredListener = listener;
}

// Wires the API client to the auth layer. Importing this module is what activates the wiring.
configureApiClient({
  getAccessToken,
  refreshAccessToken,
  onAuthFailure: () => {
    clearAccessToken();
    sessionExpiredListener?.();
  },
});

export async function signIn(input: LoginInput): Promise<void> {
  const { accessToken } = await authApi.login(input);
  setAccessToken(accessToken);
}

export async function signUp(input: RegisterInput): Promise<void> {
  const { accessToken } = await authApi.register(input);
  setAccessToken(accessToken);
}
