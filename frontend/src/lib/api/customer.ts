"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, apiFetch } from "@/lib/api/client";

// Local shapes for the customer profile/settings API (backend issue #45);
// the frozen shared contract has no customer-profile envelope yet.
export type CustomerPreferences = {
  whatsappOrderUpdates: boolean;
  whatsappStatusUpdates: boolean;
  theme: "system" | "light" | "dark";
};

export type CustomerAccount = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  deletionRequestedAt: string | null;
};

export type CustomerAddress = {
  id: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  pincode: string;
};

export type CustomerProfile = {
  customer: CustomerAccount;
  preferences: CustomerPreferences;
  addresses: CustomerAddress[];
};

export type AddressInput = {
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  pincode: string;
};

export const CUSTOMER_PROFILE_KEY = ["customer", "profile"] as const;
const CUSTOMER_SESSION_KEY = ["customer", "session"] as const;

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message || fallback;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function useCustomerProfile() {
  return useQuery<CustomerProfile>({
    queryKey: CUSTOMER_PROFILE_KEY,
    queryFn: () => apiFetch<CustomerProfile>("/customer/me"),
    staleTime: 10_000,
    retry: (failureCount, error) =>
      error instanceof ApiError && error.status >= 400 && error.status < 500
        ? false
        : failureCount < 1,
  });
}

type ProfileMutationResult = {
  customer: CustomerAccount;
  preferences: CustomerPreferences;
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name?: string; preferences?: Partial<CustomerPreferences> }) =>
      apiFetch<ProfileMutationResult>("/customer/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData<CustomerProfile>(CUSTOMER_PROFILE_KEY, (old) =>
        old ? { ...old, customer: data.customer, preferences: data.preferences } : old
      );
      queryClient.invalidateQueries({ queryKey: CUSTOMER_SESSION_KEY });
    },
  });
}

/** Preference writes are optimistic: the toggle flips immediately, the cache
 *  rolls back on failure, and the query settles with the server value. */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (preferences: Partial<CustomerPreferences>) =>
      apiFetch<ProfileMutationResult>("/customer/me", {
        method: "PATCH",
        body: JSON.stringify({ preferences }),
      }),
    onMutate: async (preferences) => {
      await queryClient.cancelQueries({ queryKey: CUSTOMER_PROFILE_KEY });
      const snapshot = queryClient.getQueryData<CustomerProfile>(CUSTOMER_PROFILE_KEY);
      queryClient.setQueryData<CustomerProfile>(CUSTOMER_PROFILE_KEY, (old) =>
        old ? { ...old, preferences: { ...old.preferences, ...preferences } } : old
      );
      return { snapshot };
    },
    onError: (_error, _preferences, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(CUSTOMER_PROFILE_KEY, context.snapshot);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_PROFILE_KEY }),
  });
}

function useProfileInvalidatingMutation<TInput, TOutput>(path: string, method: string) {
  const queryClient = useQueryClient();
  return useMutation<TOutput, unknown, TInput>({
    mutationFn: (body: TInput) =>
      apiFetch<TOutput>(path, {
        method,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_PROFILE_KEY }),
  });
}

export function useCreateAddress() {
  return useProfileInvalidatingMutation<AddressInput, { address: CustomerAddress }>(
    "/customer/me/addresses",
    "POST"
  );
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation<
    { address: CustomerAddress },
    unknown,
    {
      id: string;
    } & Partial<Omit<AddressInput, "line2" | "landmark">> & {
      line2?: string | null;
      landmark?: string | null;
    }
  >({
    mutationFn: ({ id, ...body }) =>
      apiFetch<{ address: CustomerAddress }>(`/customer/me/addresses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_PROFILE_KEY }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation<{ ok: true }, unknown, string>({
    mutationFn: (id) =>
      apiFetch<{ ok: true }>(`/customer/me/addresses/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_PROFILE_KEY }),
  });
}

export function useChangePassword() {
  return useProfileInvalidatingMutation<
    { currentPassword: string; newPassword: string },
    { ok: true }
  >("/customer/me/password", "PATCH");
}

export function useRequestDeletion() {
  return useProfileInvalidatingMutation<void, { deletionRequestedAt: string }>(
    "/customer/me/deletion-request",
    "POST"
  );
}

export function useCancelDeletion() {
  return useProfileInvalidatingMutation<void, { deletionRequestedAt: null }>(
    "/customer/me/deletion-request",
    "DELETE"
  );
}
