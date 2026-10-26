import { api } from "@/lib/api/client";
import type { UpdateProfileInput, User } from "@/lib/api/types";

export const usersApi = {
  getMe: () => api.get<User>("/users/me"),
  updateMe: (input: UpdateProfileInput) => api.patch<User>("/users/me", input),
};
