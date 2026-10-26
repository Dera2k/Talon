"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api/endpoints/settings";
import { invalidateCompletionData } from "@/lib/api/invalidation";
import { queryKeys } from "@/lib/api/query-keys";
import { useAuth } from "@/lib/auth/use-auth";

export function useSettings() {
  return useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.update,
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.settings, settings);
      // A timezone change moves "today", so everything date-derived is stale.
      return invalidateCompletionData(queryClient);
    },
  });
}

// Both calls revoke every session server-side, so the client only has to drop its local state.
export function useChangePassword() {
  const { endSession } = useAuth();
  return useMutation({ mutationFn: settingsApi.changePassword, onSuccess: () => endSession() });
}

export function useDeleteAccount() {
  const { endSession } = useAuth();
  return useMutation({ mutationFn: settingsApi.deleteAccount, onSuccess: () => endSession() });
}
