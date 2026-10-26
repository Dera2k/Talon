"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/endpoints/users";
import { queryKeys } from "@/lib/api/query-keys";

export function useMe() {
  return useQuery({ queryKey: queryKeys.me, queryFn: usersApi.getMe });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: (user) => queryClient.setQueryData(queryKeys.me, user),
  });
}
