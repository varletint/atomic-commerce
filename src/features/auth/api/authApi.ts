import api from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/api/types';
import type { User, Address } from '@/types';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  address: Address;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login: (data: LoginPayload) => api.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.LOGIN, data),

  register: (data: RegisterPayload) =>
    api.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.REGISTER, data),

  logout: () => api.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT),

  refreshTokens: () => api.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.REFRESH),

  getMe: () => api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME),

  verifyEmailByToken: (token: string) =>
    api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      params: { token },
    }),

  resendVerification: (email: string) =>
    api.post<ApiResponse<void> & { retryAfter?: number }>(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      email,
    }),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<void> & { retryAfter?: number }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    }),

  resetPassword: (data: { email: string; otp: string; password: string }) =>
    api.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
};
