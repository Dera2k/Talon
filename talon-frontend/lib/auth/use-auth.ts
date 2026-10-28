"use client";

import { createContext, useContext } from "react";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type EndSessionOptions = { redirectTo?: string };

type AuthContextValue = {
  status: AuthStatus;
  exitPath: string | null;
  logout: () => Promise<void>;
  endSession: (options?: EndSessionOptions) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
