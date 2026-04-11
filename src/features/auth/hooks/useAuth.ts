import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useCartStore } from '@/store';
import { QUERY_KEYS } from '@/constants';
import { authApi } from '../api/authApi';
import { resetRefreshState } from '@/api/axios';
import type { Address } from '@/types';

export function useAuth() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();

  // ── GET /users/me ────────────────────────────────

  const meQuery = useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: async () => {
      const { data } = await authApi.getMe();
      return data.data;
    },
    enabled: !!user,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  useEffect(() => {
    if (meQuery.isError) {
      clearAuth();
      return;
    }
    if (meQuery.isSuccess && meQuery.data) {
      setUser(meQuery.data);
    }
  }, [meQuery.isError, meQuery.isSuccess, meQuery.data, clearAuth, setUser]);

  // ── Login
  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.login(data),
    onSuccess: async ({ data }) => {
      resetRefreshState();
      if (data.data) setUser(data.data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });

      const cart = useCartStore.getState();
      await cart.mergeLocalCartToServer();
      await cart.syncCartFromServer();
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string; address: Address }) =>
      authApi.register(data),
    onSuccess: async ({ data }) => {
      resetRefreshState();
      if (data.data) setUser(data.data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });

      const cart = useCartStore.getState();
      await cart.mergeLocalCartToServer();
      await cart.syncCartFromServer();
    },
  });

  // ── Verify Email 
  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authApi.verifyEmailByToken(token),
    onSuccess: ({ data }) => {
      if (data.data) setUser(data.data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.ME });
    },
  });

  // ── Resend Verification 
  const resendVerificationMutation = useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
  });

  // ── Forgot Password 
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });

  // ── Reset Password 
  const resetPasswordMutation = useMutation({
    mutationFn: (data: { email: string; otp: string; password: string }) =>
      authApi.resetPassword(data),
  });

  // ── Logout
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
    isLoading: meQuery.isLoading,
    isMeError: meQuery.isError,

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
    resendVerificationAsync: resendVerificationMutation.mutateAsync,
    isResendingVerification: resendVerificationMutation.isPending,
    resendVerificationError: resendVerificationMutation.error,

    forgotPassword: forgotPasswordMutation.mutate,
    forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
    isForgotPasswordPending: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error,

    resetPassword: resetPasswordMutation.mutate,
    resetPasswordAsync: resetPasswordMutation.mutateAsync,
    isResetPasswordPending: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,
  };
}
