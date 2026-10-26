import { api } from "@/lib/api/client";
import type {
  AuthResult,
  ForgotPasswordInput,
  LoginInput,
  LoginResult,
  RefreshResult,
  RegisterInput,
  ResetPasswordInput,
} from "@/lib/api/types";

// skipAuth: these never carry a bearer token, and a 401 here must not trigger a refresh loop.
export const authApi = {
  register: (input: RegisterInput) =>
    api.post<AuthResult>("/auth/register", input, { skipAuth: true }),
  login: (input: LoginInput) => api.post<LoginResult>("/auth/login", input, { skipAuth: true }),
  refresh: () => api.post<RefreshResult>("/auth/refresh", undefined, { skipAuth: true }),
  logout: () => api.post<void>("/auth/logout", undefined, { skipAuth: true }),
  logoutAll: () => api.post<void>("/auth/logout-all"),
  forgotPassword: (input: ForgotPasswordInput) =>
    api.post<void>("/auth/forgot-password", input, { skipAuth: true }),
  resetPassword: (input: ResetPasswordInput) =>
    api.post<void>("/auth/reset-password", input, { skipAuth: true }),
};
