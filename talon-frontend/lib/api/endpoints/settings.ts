import { api } from "@/lib/api/client";
import type {
  ChangePasswordInput,
  DeleteAccountInput,
  Settings,
  UpdateSettingsInput,
} from "@/lib/api/types";

export const settingsApi = {
  get: () => api.get<Settings>("/settings"),
  update: (input: UpdateSettingsInput) => api.patch<Settings>("/settings", input),
  changePassword: (input: ChangePasswordInput) =>
    api.post<void>("/settings/change-password", input),
  deleteAccount: (input: DeleteAccountInput) =>
    api.delete<void>("/settings/account", input),
};
