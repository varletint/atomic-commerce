import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { QUERY_KEYS } from '@/constants';
import { authApi } from '../api/authApi';
import type { Address } from '@/types';

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();

  // ── GET /users/me ────────────────────────────────
  // On mount, try to fetch the current user via the cookie.
  // If the cookie is valid → hydrate the store.
  // If 401 (and silent refresh also fails) → clear the store.
  const { isLoading, isError: isMeError } = useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: async () => {
      const { data } = await authApi.getMe();
      return data.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      if (data) setUser(data);
      return data;
    },
  });

  // ── Login ────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.login(data),
    onSuccess: ({ data }) => {
      if (data.data) setUser(data.data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });

  // ── Register ─────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string; address: Address }) =>
      authApi.register(data),
    onSuccess: ({ data }) => {
      if (data.data) setUser(data.data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });

  // ── Verify Email ─────────────────────────────────
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmailByToken(token),
    onSuccess: ({ data }) => {
      if (data.data) setUser(data.data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });

  // ── Resend Verification ──────────────────────────
  const resendVerificationMutation = useMutation({
    mutationFn: () => authApi.resendVerification(),
  });

  // ── Logout ───────────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    isMeError,

    // Mutations
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    verifyEmail: verifyEmailMutation.mutate,
    verifyEmailAsync: verifyEmailMutation.mutateAsync,
    isVerifyingEmail: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,

    resendVerification: resendVerificationMutation.mutate,
    isResendingVerification: resendVerificationMutation.isPending,
    resendVerificationError: resendVerificationMutation.error,
  };
}
