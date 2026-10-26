"use client";

import { createContext, useContext } from "react";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  logout: () => Promise<void>;
  endSession: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
