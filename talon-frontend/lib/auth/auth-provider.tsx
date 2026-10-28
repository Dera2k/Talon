"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi } from "@/lib/api/endpoints/auth";
import { refreshAccessToken } from "@/lib/auth/refresh";
import { onSessionExpired } from "@/lib/auth/session";
import { clearAccessToken, getAccessToken } from "@/lib/auth/token-store";
import { AuthContext, type AuthStatus, type EndSessionOptions } from "@/lib/auth/use-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [exitPath, setExitPath] = useState<string | null>(null);

  const endSession = useCallback(
    (options?: EndSessionOptions) => {
      clearAccessToken();
      queryClient.clear();
      setExitPath(options?.redirectTo ?? null);
      setStatus("unauthenticated");
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // The server session may already be gone; the local logout must still happen.
    }
    endSession();
  }, [endSession]);

  useEffect(() => {
    onSessionExpired(endSession);
    return () => onSessionExpired(null);
  }, [endSession]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const token = getAccessToken() ?? (await refreshAccessToken());
        if (!cancelled) setStatus(token ? "authenticated" : "unauthenticated");
      } catch {
        if (!cancelled) setStatus("unauthenticated");
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ status, exitPath, logout, endSession }),
    [status, exitPath, logout, endSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
